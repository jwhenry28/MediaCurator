package scrapers

import (
	"net/http"
	"os"
	"strings"
	"testing"
)

func getTestDataDir() (string, error) {
	wd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	return wd + "/testdata/", nil
}

func localFileScraper() (http.RoundTripper, error) {
	dataDir, err := getTestDataDir()
	if err != nil {
		return nil, err
	}

	return http.NewFileTransport(http.Dir(dataDir)), nil
}

func TestConstructors(t *testing.T) {
	tests := []struct {
		name           string
		constructor    func(string) (Scraper, error)
		url            string
		anchors        []string
		contentSnippets []string
	}{
		{
			"DefaultScraper",
			NewDefaultScraper,
			"example.html",
			[]string{"https://www.iana.org/domains/example"},
			[]string{"This domain is for use in illustrative examples in documents."},
		},
		{
			"HackerNewsScraper",
			NewHackerNewsScraper,
			"hackernews.html",
			[]string{
				"https://www.johndcook.com/blog/2008/09/19/writes-large-correct-programs/",
				"https://www.nature.com/articles/d41586-024-03756-w",
				"https://docs.maxxinteractive.com/",
				"https://iximiuz.com/en/series/computer-networking-fundamentals/",
				"https://github.com/ColleagueRiley/RGFW",
			},
			[]string{
				"Title: Writes Large Correct Programs (2008)",
				"Title: MaXX Interactive Desktop -- the little brother of the great SGI Desktop on IRIX",
				"Title: Baby’s Second Garbage Collector",
				"Title: Marshall Brain has passed away",
				"Title: Scientists Clone Two Black-Footed Ferrets from Frozen Tissues",
			},
		},
		{
			"BusinessWireScraper",
			NewBusinessWireScraper,
			"businesswire.html",
			[]string{
				"https://www.businesswire.com/news/home/20250120918776/en/Forum-Energy-Technologies-to-Present-at-the-Sidoti-Virtual-Micro-Cap-Conference",
			},
			[]string{
				"Forum Energy Technologies to Present at the Sidoti Virtual Micro Cap Conference",
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			fileUrl := "file:///" + test.url
			scraper, err := test.constructor(fileUrl)
			if err != nil {
				t.Fatalf("failed to construct scraper: %s", test.name)
			}

			localTransport, err := localFileScraper() // redirects HTTP requests to read local files instead
			if err != nil {
				t.Fatalf("failed to construct scraper: %s", test.name)
			}

			scraper.SetTransport(localTransport)
			scraper.Scrape()
			for _, expected := range test.anchors {
				found := false
				for _, actual := range scraper.GetAnchors() {
					if expected == actual.HRef {
						found = true
						break
					}
				}

				if !found {
					t.Errorf("failed to retrieve anchor: %s", expected)
				}
			}

			for _, expected := range test.contentSnippets {
				actual := scraper.GetFormattedText()

				if !strings.Contains(actual, expected) {
					t.Fatalf("failed to retrieve content: %s\nActual:\n%s", expected, actual)
				}
			}
		})
	}
}
