// Please carefully read the README.md file for full instructions.

import React, { useEffect, useState, Fragment } from "react";
import ForgeReconciler, {
  Text,
  Button,
  ButtonGroup,
  Heading,
  Inline,
  Spinner,
  Box,
  Lozenge,
  Em,
  Strong,
  Stack,
  Icon,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const App = () => {
  const [issueData, setIssueData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOk, setIsOk] = useState(false);
  const [isError, setIsError] = useState("");
  // functions for setting the styles
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Fetching issue data from jira api
  const fetchIssueData = async () => {
    setIsLoading(true);
    try {
      const response = await invoke("getIssueData");
      if (response) {
        setIsOk(true);
      } else if (!response) {
        throw new Error("Error getting data from API! Please try again");
      }
      setIssueData(response);
    } catch (error) {
      setIsError(error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // setting styles to normal state
  const setNormal = () => {
    setIsBold(false);
    setIsItalic(false);
  };
  useEffect(() => {
    fetchIssueData();
  }, []);

  return (
    <>
      {isError !== "" && (
        <Box
          backgroundColor="color.background.accent.orange.subtle"
          padding="space.100"
        >
          <Inline space="space.100">
            <Icon glyph="warning" label="warning" />
            <Text>{isError}</Text>
          </Inline>
        </Box>
      )}
      {isLoading ? (
        <Inline alignInline="center">
          <Spinner size={"small"} label="loading" />
        </Inline>
      ) : (
        <Fragment>
          <Box padding="space.100">
            <Inline alignInline="center">
              <Heading as="h1">Issue Details</Heading>
            </Inline>
          </Box>

          <Box
            backgroundColor="color.background.accent.gray.subtlest"
            padding="space.100"
          >
            <Stack space="space.075">
              <Heading as="h4">Edit issue description styles</Heading>
              <ButtonGroup>
                <Button onClick={() => setIsBold(true)}>Bold</Button>
                <Button onClick={() => setIsItalic(true)}>Italic</Button>
                {isBold || isItalic ? (
                  <Button onClick={setNormal}>Set Normal</Button>
                ) : null}
              </ButtonGroup>
            </Stack>
          </Box>
          {isOk ? (
            <>
              <Box paddingInlineStart="space.300" paddingBlockStart="space.200">
                <Heading as="h3">{issueData.summary}</Heading>
                <Lozenge appearance="success" isBold>
                  {issueData.name}
                </Lozenge>
              </Box>
              <Box padding={"space.300"} paddingInlineStart="space.300">
                <Heading as="h5">Description</Heading>
                {!isBold && !isItalic && <Text>{issueData.description}</Text>}
                {isBold && (
                  <Text>
                    <Strong>{issueData.description}</Strong>
                  </Text>
                )}
                {isItalic && (
                  <Text>
                    <Em>{issueData.description}</Em>
                  </Text>
                )}
                {!issueData.description && (
                  <Box paddingBlock="space.200">
                    <Text>Description is empty!</Text>
                  </Box>
                )}
                <Box paddingBlock="space.200">
                  <Button
                    appearance="primary"
                    onClick={async () => await fetchIssueData()}
                  >
                    Refresh Issue
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Text>Data is currently unavailable!</Text>
          )}
        </Fragment>
      )}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
