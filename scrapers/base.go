package scrapers

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/gocolly/colly"
	"github.com/jwhenry28/MediaCurator/model"
	"golang.org/x/net/publicsuffix"
)

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9"

type Scraper interface {
	Scrape()
	SetTransport(http.RoundTripper)
	GetURL() string
	GetHostname() string
	GetErr() error
	GetStatusCode() int
	GetAnchors() []model.Anchor
	GetFormattedText() string
}

type BaseScraper struct {
	Anchors    []model.Anchor
	InnerText  string
	FullText   string
	Err        error
	StatusCode int

	collector *colly.Collector
	url       *url.URL
}

func NewBaseScraper(urlString string) (BaseScraper, error) {
	url, err := url.ParseRequestURI(formatURL(urlString))
	if err != nil {
		return BaseScraper{}, err
	}

	return BaseScraper{
		Anchors:   []model.Anchor{},
		collector: colly.NewCollector(),
		url:       url,
	}, nil
}

func (s *BaseScraper) SetTransport(transport http.RoundTripper) {
	s.collector.WithTransport(transport)
}

func formatURL(url string) string {
	if !strings.HasPrefix(url, "http") && !strings.HasPrefix(url, "file://") {
		url = "https://" + url
	}

	url = strings.TrimSuffix(url, "/")

	return url
}

func (s *BaseScraper) GetURL() string {
	return s.url.String()
}

func (s *BaseScraper) GetHostname() string {
	return s.url.Hostname()
}

func (s *BaseScraper) GetErr() error {
	return s.Err
}

func (s *BaseScraper) GetStatusCode() int {
	return s.StatusCode
}

func (s *BaseScraper) Scrape() {
	s.FullText = ""
	s.InnerText = ""
	s.Anchors = []model.Anchor{}
	s.collector.Visit(s.GetURL())
	s.collector.Wait()
}

func (s *BaseScraper) GetAnchors() []model.Anchor {
	seen := make(map[string]bool)
	unique := make([]model.Anchor, 0)

	for _, anchor := range s.Anchors {
		if !seen[anchor.HRef] {
			seen[anchor.HRef] = true
			unique = append(unique, anchor)
		}
	}

	return unique
}

func (s *BaseScraper) GetFormattedText() string {
	return s.FullText
}

func (s *BaseScraper) isExternalUrl(urlString string) bool {
	url, err := url.ParseRequestURI(urlString)
	if err != nil {
		return false
	}
	hostRoot, _ := publicsuffix.EffectiveTLDPlusOne(s.url.Hostname())
	targetRoot, err := publicsuffix.EffectiveTLDPlusOne(url.Hostname())
	return err == nil && hostRoot != targetRoot
}

func (s *BaseScraper) isInternalUrl(urlString string) bool {
	if strings.HasPrefix(urlString, "/") {
		return true
	}

	url, err := url.ParseRequestURI(urlString)
	if err != nil {
		return false
	}

	hostRoot, _ := publicsuffix.EffectiveTLDPlusOne(s.url.Hostname())
	targetRoot, err := publicsuffix.EffectiveTLDPlusOne(url.Hostname())
	return err == nil && hostRoot == targetRoot
}
