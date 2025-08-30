import React from 'react';

export interface RichTextDocument {
  nodeType: string;
  data: Record<string, unknown>;
  content: RichTextNode[];
}

interface RichTextNode {
  nodeType: string;
  data: Record<string, unknown>;
  content?: RichTextNode[];
  value?: string;
  marks?: { type: string }[];
}

const RichTextRenderer: React.FC<{ document: RichTextDocument }> = ({ document }) => {
  if (!document || !document.content) {
    return null;
  }

  const renderNode = (node: RichTextNode, index: number): React.ReactNode => {
    switch (node.nodeType) {
      case 'paragraph':
        return <p key={index}>{node.content?.map((child, i) => renderNode(child, i))}</p>;
      case 'heading-1':
        return <h1 key={index}>{node.content?.map((child, i) => renderNode(child, i))}</h1>;
      case 'heading-2':
        return <h2 key={index}>{node.content?.map((child, i) => renderNode(child, i))}</h2>;
      case 'heading-3':
        return <h3 key={index}>{node.content?.map((child, i) => renderNode(child, i))}</h3>;
      case 'heading-4':
        return <h4 key={index}>{node.content?.map((child, i) => renderNode(child, i))}</h4>;
      case 'heading-5':
        return <h5 key={index}>{node.content?.map((child, i) => renderNode(child, i))}</h5>;
      case 'heading-6':
        return <h6 key={index}>{node.content?.map((child, i) => renderNode(child, i))}</h6>;
      case 'unordered-list':
        return <ul key={index}>{node.content?.map((child, i) => renderNode(child, i))}</ul>;
      case 'ordered-list':
        return <ol key={index}>{node.content?.map((child, i) => renderNode(child, i))}</ol>;
      case 'list-item':
        return <li key={index}>{node.content?.map((child, i) => renderNode(child, i))}</li>;
      case 'text':
        let textContent: React.ReactNode = node.value;
        if (node.marks) {
          node.marks.forEach(mark => {
            if (mark.type === 'bold') {
              textContent = <strong>{textContent}</strong>;
            } else if (mark.type === 'italic') {
              textContent = <em>{textContent}</em>;
            } else if (mark.type === 'underline') {
              textContent = <u>{textContent}</u>;
            }
            // Add more mark types as needed (e.g., 'code', 'strikethrough')
          });
        }
        return <React.Fragment key={index}>{textContent}</React.Fragment>;
      // Add more node types as needed (e.g., 'embedded-asset-block', 'embedded-entry-block')
      default:
        return null;
    }
  };

  return <>{document.content.map((node, index) => renderNode(node, index))}</>;
};

export default RichTextRenderer;
