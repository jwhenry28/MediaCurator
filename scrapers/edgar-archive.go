package scrapers

import (
	"log/slog"
	"strings"

	"github.com/gocolly/colly"
)

type EDGARArchiveScraper struct {
	*BaseScraper
	extractedText string
	textLimit     int
}

func (s *EDGARArchiveScraper) initialize() {
	if s.textLimit == 0 {
		s.textLimit = 10000
	}
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
		slog.Error("EDGARArchiveScraper error", "error", err, "status code", r.StatusCode)
	})

	s.collector.OnHTML("tr", func(e *colly.HTMLElement) {
		// Check if the second column starts with "SC TO"
		secondColumnText := e.ChildText("td:nth-child(2)")
		if len(secondColumnText) > 0 && strings.HasPrefix(secondColumnText, "SC TO") {
			// Extract the anchor text and href from the third column
			e.ForEach("td:nth-child(3) a", func(_ int, anchor *colly.HTMLElement) {
				href := anchor.Attr("href")
				fullUrl := "https://www.sec.gov" + href
				s.collector.Visit(fullUrl)
			})
		}
	})

	s.collector.OnHTML("p,font,div,span", func(e *colly.HTMLElement) {
		// Extract text from <p>, <div>, and <body> tags
		text := e.Text

		// Limit to the first 1000 characters
		if len(s.extractedText) >= s.textLimit {
			return
		}
		remaining := s.textLimit - len(s.extractedText)
		if len(text) > remaining {
			text = text[:remaining]
		}
		s.extractedText += text
	})
}

// Method to retrieve the extracted text
func (s *EDGARArchiveScraper) GetFormattedText() string {
	return s.extractedText
}
