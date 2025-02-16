package scrapers

import (
	"log/slog"
	"strings"
	"time"

	"github.com/gocolly/colly"
	"github.com/jwhenry28/MediaCurator/model"
)

type EDGARFilingsScraper struct {
	*BaseScraper
	currentCompany string
}

func (s *EDGARFilingsScraper) initialize() {
	s.collector.UserAgent = USER_AGENT

	s.collector.OnRequest(func(r *colly.Request) {
		s.Err = nil
	})

	s.collector.OnResponse(func(r *colly.Response) {
		s.StatusCode = r.StatusCode
		s.Err = nil
	})

	s.collector.OnError(func(r *colly.Response, err error) {
		s.StatusCode = r.StatusCode
		s.Err = err
		slog.Error("EDGARFilingsScraper error", "error", err, "status code", r.StatusCode)
	})

	s.collector.OnHTML("tr", func(e *colly.HTMLElement) {
		// Get the company name from the third column (if it exists)
		currentCompany := e.ChildText("td:nth-child(3) a")
		if currentCompany != "" {
			s.currentCompany = currentCompany
		}

		// Look for format links in the second column
		e.ForEach("td:nth-child(2) a[href]", func(_ int, link *colly.HTMLElement) {
			href := link.Attr("href")
			text := link.Text

			// Handle relative URLs
			if !strings.HasPrefix(href, "http") {
				hostname := s.GetHostname()
				if !strings.HasPrefix(href, "/") {
					href = "/" + href
				}
				href = "https://" + hostname + href
			}

			// Only process HTML format links
			if text != "[html]" {
				return
			}

			// Check filing date first (5th column)
			filingDate := e.ChildText("td:nth-child(5)")
			if filingDate == "" || filingDate != time.Now().Format("2006-01-02") {
				return
			}

			// Create anchor with company name as title
			anchor := model.NewAnchor(s.currentCompany, href)
			s.Anchors = append(s.Anchors, anchor)
		})
	})

	s.collector.OnScraped(func(r *colly.Response) {
		s.StatusCode = r.StatusCode
	})
}

func (s *EDGARFilingsScraper) GetFormattedText() string {
	formatted := ""
	for _, anchor := range s.GetAnchors() {
		formatted += "Title: " + anchor.Text + "\n"
		formatted += "HRef: " + anchor.HRef + "\n\n"
	}
	return formatted
}
