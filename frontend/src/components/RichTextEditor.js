/* eslint-disable */

import {React, useState, useEffect, useMemo} from "react";
import {Editor, createEditor, Transforms, Element as SlateElement, Range} from "slate";
import {Slate, Editable, withReact, useSlate} from "slate-react";
import {withHistory} from "slate-history";
import "../styles/rich_text_editor.css";
import PropTypes from "prop-types";

import isHotkey from "is-hotkey";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import FormatStrikethroughIcon from "@material-ui/icons/FormatStrikethrough";
import FormatSizeIcon from "@material-ui/icons/FormatSize";
import LooksOneIcon from "@material-ui/icons/LooksOne";
import LooksTwoIcon from "@material-ui/icons/LooksTwo";
import Looks3Icon from "@material-ui/icons/Looks3";
import Looks4Icon from "@material-ui/icons/Looks4";
import Looks5Icon from "@material-ui/icons/Looks5";
import Looks6Icon from "@material-ui/icons/Looks6";
import LinkIcon from "@material-ui/icons/Link";
import LinkOffIcon from "@material-ui/icons/LinkOff";

const FORMATS = ["bold", "italic", "underline", "strikethrough"];

const ICONS = {
  bold: <FormatBoldIcon />,
  italic: <FormatItalicIcon />,
  underline: <FormatUnderlinedIcon />,
  strikethrough: <FormatStrikethroughIcon />,
  fontSize: <FormatSizeIcon />,
  one: <LooksOneIcon />,
  two: <LooksTwoIcon />,
  three: <Looks3Icon />,
  four: <Looks4Icon />,
  five: <Looks5Icon />,
  six: <Looks6Icon />,
  link: <LinkIcon />,
  unlink: <LinkOffIcon />
};

const HOTKEYS = {
  bold: isHotkey("ctrl+b"),
  italic: isHotkey("ctrl+i"),
  underline: isHotkey("ctrl+u"),
  strikethrough: isHotkey("alt+shift+5")
};

const LARGER_SIZE = {
  h1: "",
  h2: "h1",
  h3: "h2",
  p: "h3",
  h5: "p",
  h6: "h5",
  hotkey: isHotkey("ctrl+shift+.")
};

const SMALLER_SIZE = {
  h1: "h2",
  h2: "h3",
  h3: "p",
  p: "h5",
  h5: "h6",
  h6: "",
  hotkey: isHotkey("ctrl+shift+,")
};

const RichTextEditor = ({cb, data, idx}) => {

  const [showSizes, setShowSizes] = useState(false);
  const [fadedIn, setFadedIn] = useState(false);
  const [fadedOut, setFadedOut] = useState(true);
  const [active, setActive] = useState(true);
  const [currentSize, setCurrentSize] = useState("p");
  const [selection, setSelection] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const withLinks = (editor) => {
    const {isInline, onChange} = editor;
    editor.isInline = (element) => {
      return element.type === "link" ? true : isInline(element);
    };
    editor.onChange = () => {
      if (editor.selection !== null) {
        setSelection(editor.selection);
        setCollapsed(editor.selection && Range.isCollapsed(editor.selection));
      }
      onChange();
    };
    return editor;
  };

  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), []);

  const renderElement = ({attributes, children, element}) => {
    switch (element.type) {
    case "link":
      return <a href={element.data.href} {...attributes}>{children}</a>;
    case "h1":
      return <h1 {...attributes}>{children}</h1>;
    case "h2":
      return <h2 {...attributes}>{children}</h2>;
    case "h3":
      return <h3 {...attributes}>{children}</h3>;
    case "p":
      return <p {...attributes}>{children}</p>;
    case "h5":
      return <h5 {...attributes}>{children}</h5>;
    case "h6":
      return <h6 {...attributes}>{children}</h6>;
    default:
      return <p {...attributes}>{children}</p>;
    }
  };

  const renderLeaf = ({attributes, children, leaf}) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.code) children = <code>{children}</code>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;
    return <span {...attributes}>{children}</span>;
  };

  const [content, setContent] = useState(data || [{type: "p", children: [{text: ""}]}]);

  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] : false;
  };

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);
  
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
    });
  
    return !!match;
  };

  const toggleBlock = (editor, format) => {
    if (format === "") return;
    const isActive = isBlockActive(editor, format);
    Transforms.unwrapNodes(editor, {
      match: () => false,
      split: true
    });
    const newProperties = {
      type: isActive ? "p" : format
    };
    setCurrentSize(newProperties.type);
    Transforms.setNodes(editor, newProperties);
  };

  const StyleButton = ({format, icon}) => {
    const editor = useSlate();
    return (
      <span className="style-button" style={isMarkActive(editor, format) ? {backgroundColor: "#AAA"} : {}} onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}>
        {ICONS[icon]}
      </span>
    );
  };
  StyleButton.propTypes = {
    format: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  };

  const BlockButton = ({format, icon}) => {
    const editor = useSlate();
    const style = {
      backgroundColor: isBlockActive(editor, format) ? "#AAA" : ""
    };
    const classlist = `block-button${active ? showSizes ? " active" : " inactive" : ""}${fadedIn ? " finished-fade-in" : ""}${fadedOut ? " finished-fade-out" : ""}`;
    return (
      <span className={classlist} style={style} onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}>
        {ICONS[icon]}
      </span>
    );
  };
  BlockButton.propTypes = {
    format: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  };

  const delink = (editor) => {
    Transforms.unwrapNodes(editor, {match: (n) => {
      return SlateElement.isElement(n) && n.type === "link";
    }});
  };

  const LinkButton = () => {
    const editor = useSlate();
    const [insertActive, setInsertActive] = useState(false);
    const [textValue, setTextValue] = useState("");
    const [linkValue, setLinkValue] = useState("");
    return (
      <div style={{display: "inline-block"}}>
        <span className="style-button" style={showPopup ? {backgroundColor: "#AAA"} : {}} onMouseDown={() => setShowPopup(!showPopup)}>
          {ICONS.link}
        </span>
        <div className="link-popup" style={showPopup ? {} : {display: "none"}}>
          <div className="link-popup-display" style={collapsed ? {} : {display: "none"}}>
            <p className="link-popup-display-label">Text</p>
            <input className="link-popup-display-input" type="text" onChange={(e) => setTextValue(e.target.value)} />
          </div>
          <div className="link-popup-link">
            <p className="link-popup-link-label">Link</p>
            <input className="link-popup-link-input" type="text" onChange={(e) => setLinkValue(e.target.value)} />
          </div>
          <span className="link-popup-submit" style={insertActive ? {borderStyle: "inset", backgroundColor: "#BBB"} : {}}
            onMouseDown={(e) => {
              e.preventDefault();
              if ((collapsed && !textValue.length) || !linkValue.length) return;
              setInsertActive(true);
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              if (!insertActive) return;
              setInsertActive(false);
              if ((collapsed && !textValue.length) || !linkValue.length) return;
              const linkElement = {
                type: "link",
                data: {href: linkValue},
                children: collapsed ? [{text: textValue}] : []
              };
              if (collapsed) {
                Transforms.insertNodes(editor, linkElement, {at: selection});
              }
              else {
                Transforms.select(editor, selection);
                delink(editor);
                Transforms.wrapNodes(editor, linkElement, {split: true});
                Transforms.collapse(editor, {edge: "end"});
              }
              setShowPopup(false);
            }}
          >
            Insert
          </span>
        </div>
      </div>
    );
  };

  const UnlinkButton = () => {
    const editor = useSlate();
    return (
      <span className="style-button" onMouseDown={(e) => {
        e.preventDefault();
        Transforms.select(editor, selection);
        delink(editor);
      }}>
        {ICONS.unlink}
      </span>
    );
  };

  const toggleShowSizes = (e) => {
    e.preventDefault();
    if (!active) setActive(true);
    if (fadedOut) setFadedOut(false);
    setShowSizes(!showSizes);
  };

  const SizeButton = () => {
    return (
      <span className="size-button" style={showSizes ? {backgroundColor: "#AAA"} : {}} onMouseDown={toggleShowSizes}>
        {ICONS.fontSize}
      </span>
    );
  };

  const parseText = (node) => {
    let str;
    str = node.text;
    if (node.bold) str = `<b>${str}</b>`;
    if (node.italic) str = `<i>${str}</i>`;
    if (node.underline) str = `<u>${str}</u>`;
    if (node.strikethrough) str = `<s>${str}</s>`;
    return str;
  }

  const parseAll = (nodes, prefix, data = {}) => {
    let outputStrings = [];
    let prefixActive = false;
    for (const node of nodes) {
      if (node.type) {
        outputStrings = outputStrings.concat(parseAll(node.children, node.type === "link" ? "a" : node.type, node.data || {}));
      }
      else {
        if (!prefixActive) {
          outputStrings.push(`<${prefix} ${Object.keys(data).map((k) => `${k}=\"${data[k]}\"`).join(" ")}>`);
          prefixActive = true;
        }
        outputStrings.push(parseText(node));
      }
    }
    if (prefixActive) {
      outputStrings.push(`</${prefix}>`);
      prefixActive = false;
    }
    return outputStrings.join("");
  };

  useEffect(() => {
    toggleBlock(editor, "p");
    document.addEventListener("animationstart", (e) => {
      if (e.animationName === "fade-in") setFadedOut(false);
      else if (e.animationName === "fade-out") setFadedIn(false);
    });
    document.addEventListener("animationend", (e) => {
      if (e.animationName === "fade-in") {
        setActive(false);
        setFadedIn(true);
      }
      else if (e.animationName === "fade-out") setFadedOut(true);
    });
  }, []);

  return (
    <div className="rich-text-editor">
      <Slate editor={editor} value={content} onChange={(c) => {
        setContent(c);
        cb(c, idx);
      }}>
        <div className="editor-control">
          <StyleButton format="bold" icon="bold" />
          <StyleButton format="italic" icon="italic" />
          <StyleButton format="underline" icon="underline" />
          <StyleButton format="strikethrough" icon="strikethrough" />
          <SizeButton />
          <BlockButton format="h1" icon="one" />
          <BlockButton format="h2" icon="two" />
          <BlockButton format="h3" icon="three" />
          <BlockButton format="p" icon="four" />
          <BlockButton format="h5" icon="five" />
          <BlockButton format="h6" icon="six" />
          <LinkButton />
          <UnlinkButton />
        </div>
        <div className="editor-area">
          <Editable style={{width: "100%", height: "100%"}} autoFocus spellCheck={false} readOnly={false} renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={(e) => {
            for (const format of FORMATS) {
              const hk = HOTKEYS[format];
              if (hk(e)) {
                e.preventDefault();
                toggleMark(editor, format);
              }
            }
            if (LARGER_SIZE.hotkey(e)) {
              e.preventDefault();
              toggleBlock(editor, LARGER_SIZE[currentSize]);
            }
            else if (SMALLER_SIZE.hotkey(e)) {
              e.preventDefault();
              toggleBlock(editor, SMALLER_SIZE[currentSize]);
            }
          }} />
        </div>
      </Slate>
    </div>
  );

};

RichTextEditor.propTypes = {
};

export default RichTextEditor;