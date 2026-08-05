// components/nodes/index.js — builds the React Flow nodeTypes map.
// Each config-driven type gets auto-wrapped in a memoized BaseNode factory.

import React, { memo } from 'react';
import BaseNode  from './BaseNode';
import TextNode  from './TextNode';
import { NODE_CONFIGS } from './configs';

function createNode(config) {
  const C = memo((props) => <BaseNode {...props} config={config} />);
  C.displayName = `Node_${config.title.replace(/\s+/g, '')}`;
  return C;
}

export const nodeTypes = {
  text: TextNode,
  ...Object.fromEntries(
    Object.entries(NODE_CONFIGS).map(([type, cfg]) => [type, createNode(cfg)])
  ),
};
