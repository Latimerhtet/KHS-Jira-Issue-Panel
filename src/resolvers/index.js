import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
const resolver = new Resolver();

resolver.define("getIssueData", async ({ context, payload }) => {
  const issueKey = context.extension.issue.key;

  const response = await api
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueKey}?fields=summary,description,priority`
    );
  const { summary, description, priority } = (await response.json()).fields;
  console.log(summary);
  console.log(description);
  console.log(priority);
  return {
    summary: summary,
    description: description,
    name: priority.name,
    icon: priority.iconUrl,
  };
});

export const handler = resolver.getDefinitions();
