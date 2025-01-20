package scrapers

import (
	"log/slog"

	"github.com/gocolly/colly"
	"github.com/jwhenry28/MediaCurator/model"
)

type HackerNewsScraper struct {
	BaseScraper
}

func NewHackerNewsScraper(urlString string) (Scraper, error) {
	baseScraper, err := NewBaseScraper(urlString)
	if err != nil {
		return nil, err
	}
	s := HackerNewsScraper{
		BaseScraper: baseScraper,
	}
	s.initialize()
	return &s, nil
}

func (s *HackerNewsScraper) initialize() {
	s.collector.OnRequest(func(r *colly.Request) {
		s.Err = nil
	})
	s.collector.OnError(func(r *colly.Response, err error) {
		slog.Warn("scraper error", "error", err)
		s.StatusCode = r.StatusCode
		s.Err = err
	})
	s.collector.OnHTML("a", func(e *colly.HTMLElement) {
		hyperlink := e.Attr("href")
		if s.isExternalUrl(hyperlink) {
			s.Anchors = append(s.Anchors, model.NewAnchor(e.Text, hyperlink))
		}
	})
}

func (s *HackerNewsScraper) GetFormattedText() string {
	formatted := ""
	for _, anchor := range s.GetAnchors() {
		formatted += "Title: " + anchor.Text + "\n"
		formatted += "HRef: " + anchor.HRef + "\n\n"
	}

	return formatted
}
