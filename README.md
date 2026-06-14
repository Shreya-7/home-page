# home

A small index page for our projects.

## Adding a project

Edit [`projects.json`](projects.json). Append an object to one of three groups:

- `ours` — our active projects (always visible)
- `hosted` — third-party services we self-host (always visible)
- `more` — archived projects and experiments (collapsed by default, click `[ more ]` to expand)

```json
{
  "path": "./newthing",
  "url": "https://newthing.example",
  "desc": "one-line description",
  "status": "live",
  "meta": [
    { "label": "gh", "url": "https://github.com/..." },
    { "label": "docs", "url": "https://..." }
  ]
}
```

### Fields

| field    | required | notes                                             |
|----------|----------|---------------------------------------------------|
| `path`   | yes      | shown as the link text, e.g. `./blog`             |
| `url`    | yes      | where the row links to                            |
| `desc`   | yes      | one-line description                              |
| `status` | no       | `live` \| `wip` \| `dormant` \| `archived` (default `live`) |
| `meta`   | no       | array of `{ label, url }` shown when `+` is clicked |

Save the file and reload the page. No build step.
