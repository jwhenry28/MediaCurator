package tools

import "github.com/jwhenry28/LLMAgents/shared/tools"

func init() {
	tools.Registry["decide"] = NewDecide
	tools.Registry["fetch"] = NewFetch
}
