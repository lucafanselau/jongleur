import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import React, { FC } from "react";

const PkgCommands: FC<{ type: "add"; cmd: string }> = ({ type, cmd }) => {
  return (
    <Tabs groupId="pkg-manager">
      <TabItem value="pnpm" label="pnpm" default>
        <CodeBlock language="bash">
          pnpm {type === "add" ? "add" : ""} {cmd}
        </CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock language="bash">
          yarn {type === "add" ? "add" : ""} {cmd}
        </CodeBlock>
      </TabItem>
      <TabItem value="npm" label="npm">
        <CodeBlock language="bash">
          npm {type === "add" ? "install" : ""} {cmd}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export default PkgCommands;
