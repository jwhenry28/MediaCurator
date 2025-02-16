package scrapers

type ScraperConstructor func(string) (Scraper, error)

var ScrapersRegistry = map[string]ScraperConstructor{
	"news.ycombinator.com": NewHackerNewsScraper,
	"arxiv.org":            NewArxivScraper,
	"nautil.us":            NewNautilusScraper,
	"medium.com":           NewMediumScraper,
	"sec.gov":              NewEDGARScraper,
	"www.sec.gov":          NewEDGARScraper,
}
