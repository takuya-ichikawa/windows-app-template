import React from "react";
import { Button, Stack, Text, Title } from "@mantine/core";

function App(): React.JSX.Element {
  return (
    <Stack p="md">
      <Title order={2}>Electron + Mantine へようこそ！</Title>
      <Text>Mantine が正常に動作しています。</Text>
      <Button>クリック</Button>
    </Stack>
  );
}

export default App;
