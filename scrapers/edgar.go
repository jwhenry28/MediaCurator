package scrapers

import (
	"fmt"
	"net/url"
	"strings"
)

func NewEDGARScraper(urlString string) (Scraper, error) {
	baseScraper, err := NewBaseScraper(urlString)
	if err != nil {
		return nil, err
	}

	url, err := url.Parse(urlString)
	if err != nil {
		return nil, err
	}

	if url.Path == "/cgi-bin/browse-edgar" {
		s := EDGARFilingsScraper{
			BaseScraper: &baseScraper,
		}
		s.initialize()
		return &s, nil
	} else if strings.HasPrefix(url.Path, "/Archives/edgar/") {
		s := EDGARArchiveScraper{
			BaseScraper: &baseScraper,
		}
		s.initialize()
		return &s, nil
	}
	return nil, fmt.Errorf("invalid URL: %s", urlString)
}
