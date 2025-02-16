package scrapers

import (
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/gocolly/colly"
	"github.com/jwhenry28/MediaCurator/model"
)

type BusinessWireScraper struct {
	BaseScraper
	Done     bool
	Titles   []string
	HRefs    []string
	Dates    []time.Time
	NextPage string
}

func NewBusinessWireScraper(urlString string) (Scraper, error) {
	baseScraper, err := NewBaseScraper(urlString)
	if err != nil {
		return nil, err
	}
	s := BusinessWireScraper{
		BaseScraper: baseScraper,
		Done:        false,
		Titles:      []string{},
		HRefs:       []string{},
		Dates:       []time.Time{},
	}
	s.initialize()
	return &s, nil
}

func (s *BusinessWireScraper) initialize() {
	s.collector.UserAgent = USER_AGENT
	s.collector.OnHTML("div[itemtype='http://schema.org/NewsArticle']", func(e *colly.HTMLElement) {
		articleURL := e.Attr("itemid")
		if articleURL != "" {
			s.HRefs = append(s.HRefs, articleURL)
		}

		headline := e.ChildText("span[itemprop='headline']")
		if headline != "" {
			s.Titles = append(s.Titles, headline)
		}

		timeStr := e.ChildAttr("time[itemprop='dateModified']", "datetime")
		if timeStr != "" {
			if parsedTime, err := time.Parse(time.RFC3339, timeStr); err == nil {
				s.Dates = append(s.Dates, parsedTime)
			} else {
				slog.Warn("failed to parse date", "error", err, "text", timeStr)
			}
		}
	})

	s.collector.OnHTML("div.pagingNext", func(e *colly.HTMLElement) {
		nextLink := e.ChildAttr("a", "href")
		if nextLink != "" {
			if !strings.HasPrefix(nextLink, "http") {
				baseURL := s.GetURL()
				if !strings.HasSuffix(baseURL, "/") && !strings.HasPrefix(nextLink, "/") {
					baseURL += "/"
				}
				nextLink = baseURL + nextLink
			}
			s.NextPage = nextLink
		} else {
			s.Done = true
		}
	})

	s.collector.OnError(func(r *colly.Response, err error) {
		slog.Warn("scraper error", "error", err)
		fmt.Println(string(r.Body))
		s.StatusCode = r.StatusCode
		s.Err = err
	})
}

func (s *BusinessWireScraper) Scrape() {
	s.FullText = ""
	s.InnerText = ""
	s.Anchors = []model.Anchor{}

	guardrail := 10 // Maximum number of pages to scrape
	pageCount := 0

	currentURL := s.url.String()
	for !s.Done && pageCount < guardrail {
		s.collector.Visit(currentURL)
		s.collector.Wait()

		if s.NextPage == "" {
			s.Done = true
		} else {
			currentURL = s.NextPage
			pageCount++
		}
	}

	if pageCount >= guardrail {
		slog.Warn("guardrail hit - stopping pagination", "guardrail", guardrail)
	}

	// Validate data consistency
	if len(s.HRefs) != len(s.Titles) || len(s.Titles) != len(s.Dates) {
		slog.Warn("scraper mismatch",
			"href count", len(s.HRefs),
			"title count", len(s.Titles),
			"date count", len(s.Dates))
	}

	// Create anchors from collected data
	for i, href := range s.HRefs {
		if i < len(s.Titles) {
			s.Anchors = append(s.Anchors, model.NewAnchor(s.Titles[i], href))
		}
	}
}

func (s *BusinessWireScraper) GetFormattedText() string {
	var formatted strings.Builder
	for i, anchor := range s.GetAnchors() {
		formatted.WriteString("Title: " + anchor.Text + "\n")
		formatted.WriteString("URL: " + anchor.HRef + "\n")
		if i < len(s.Dates) {
			formatted.WriteString("Date: " + s.Dates[i].Format(time.RFC3339) + "\n")
		}
		formatted.WriteString("\n")
	}
	return formatted.String()
}
