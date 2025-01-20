package tools

import (
	"golang.org/x/exp/slices"

	"github.com/jwhenry28/LLMUtils/model"
	"github.com/jwhenry28/LLMUtils/tools"
)

type Decide struct {
	AllowedArgs []string
	tools.Base
}

func NewDecide(input model.ToolInput) tools.Tool {
	name := "decide"
	args := []string{"decision", "title", "url", "justification"}
	brief := "issues a final decision about an article."
	explanation := `args:
- title: The anchor tag's title/inner text
- url: The URL from the anchor tag you are making a decision about
- decision: Your decision. Must be one of the following:
	- IGNORE: Choose this option if you do not think your client will be interested in reading this URL today.
	- NOTIFY: Choose this option if you would like to forward this URL to your client
- justification: A short explanation for your decision`
	return Decide{
		AllowedArgs: []string{"NOTIFY", "IGNORE"},
		Base:        tools.Base{Input: input, BriefText: brief, Name: name, Args: args, ExplanationText: explanation},
	}
}

func (task Decide) Match() bool {
	args := task.Input.GetArgs()
	return len(args) == 4 && slices.Contains(task.AllowedArgs, args[0])
}

func (task Decide) Invoke() string {
	args := task.Input.GetArgs()
	if args[0] == "NOTIFY" {
		return "notified"
	} else if args[0] == "IGNORE" {
		return "ignored"
	}

	return "unknown decision"
}
