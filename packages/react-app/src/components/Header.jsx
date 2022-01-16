import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/NeoDaoist/guilds" target="_blank" rel="noopener noreferrer">
      <PageHeader title="🧪🎻 Tne Guilds of Sibiu" subTitle="⚒️🎼 Smart Score Demo" style={{ cursor: "pointer" }} />
    </a>
  );
}
