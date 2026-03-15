# Do not set HTML using unsafe methods from WinJS.Utilities (no-winjs-html-unsafe)

Calls to `setInnerHTMLUnsafe`, `setOuterHTMLUnsafe`, or `insertAdjacentHTMLUnsafe` methods from Windows Library for JavaScript (WinJS) do not perform input validation and should be avoided.

Use safer alternatives such as `setInnerHTML` and explicit DOM construction APIs instead.
