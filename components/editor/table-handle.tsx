import type { EditorExtension } from "./extension";
import { GripHorizontal, GripVertical } from "lucide-react";
import type { Editor } from "prosekit/core";
import { useEditorDerivedValue } from "prosekit/react";
import {
  TableHandleColumnRoot,
  TableHandleColumnTrigger,
  TableHandleDragPreview,
  TableHandleDropIndicator,
  TableHandlePopoverContent,
  TableHandlePopoverItem,
  TableHandleRoot,
  TableHandleRowRoot,
  TableHandleRowTrigger,
} from "prosekit/react/table-handle";

function getTableHandleState(editor: Editor<EditorExtension>) {
  return {
    addTableColumnBefore: {
      canExec: editor.commands.addTableColumnBefore.canExec(),
      command: () => editor.commands.addTableColumnBefore(),
    },
    addTableColumnAfter: {
      canExec: editor.commands.addTableColumnAfter.canExec(),
      command: () => editor.commands.addTableColumnAfter(),
    },
    deleteCellSelection: {
      canExec: editor.commands.deleteCellSelection.canExec(),
      command: () => editor.commands.deleteCellSelection(),
    },
    deleteTableColumn: {
      canExec: editor.commands.deleteTableColumn.canExec(),
      command: () => editor.commands.deleteTableColumn(),
    },
    addTableRowAbove: {
      canExec: editor.commands.addTableRowAbove.canExec(),
      command: () => editor.commands.addTableRowAbove(),
    },
    addTableRowBelow: {
      canExec: editor.commands.addTableRowBelow.canExec(),
      command: () => editor.commands.addTableRowBelow(),
    },
    deleteTableRow: {
      canExec: editor.commands.deleteTableRow.canExec(),
      command: () => editor.commands.deleteTableRow(),
    },
  };
}

export function TableHandle() {
  const state = useEditorDerivedValue(getTableHandleState);

  return (
    <TableHandleRoot className="contents">
      <TableHandleDragPreview />
      <TableHandleDropIndicator />
      <TableHandleColumnRoot className="data-[state=open]:animate-duration-150 data-[state=closed]:animate-duration-200 box-border flex h-[1.2em] w-[1.5em] translate-y-3 items-center justify-center rounded border border-solid border-gray-200 bg-white text-gray-500/50 will-change-transform hover:bg-gray-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:text-gray-500/50 dark:hover:bg-gray-800 [&:not([data-state])]:hidden">
        <TableHandleColumnTrigger>
          <GripHorizontal className="h-4 w-4" />
        </TableHandleColumnTrigger>
        <TableHandlePopoverContent className="relative z-10 box-border block max-h-[25rem] min-w-[8rem] select-none overflow-auto whitespace-nowrap rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950 [&:not([data-state])]:hidden">
          {state.addTableColumnBefore.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.addTableColumnBefore.command}
            >
              <span>Insert Left</span>
            </TableHandlePopoverItem>
          )}
          {state.addTableColumnAfter.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.addTableColumnAfter.command}
            >
              <span>Insert Right</span>
            </TableHandlePopoverItem>
          )}
          {state.deleteCellSelection.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.deleteCellSelection.command}
            >
              <span>Clear Contents</span>
              <span className="text-xs tracking-widest text-gray-500 dark:text-gray-500">Del</span>
            </TableHandlePopoverItem>
          )}
          {state.deleteTableColumn.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.deleteTableColumn.command}
            >
              <span>Delete Column</span>
            </TableHandlePopoverItem>
          )}
        </TableHandlePopoverContent>
      </TableHandleColumnRoot>
      <TableHandleRowRoot className="data-[state=open]:animate-duration-150 data-[state=closed]:animate-duration-200 box-border flex h-[1.5em] w-[1.2em] translate-x-3 items-center justify-center rounded border border-solid border-gray-200 bg-white text-gray-500/50 will-change-transform hover:bg-gray-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:text-gray-500/50 dark:hover:bg-gray-800 [&:not([data-state])]:hidden">
        <TableHandleRowTrigger>
          <GripVertical className="h-4 w-4" />
        </TableHandleRowTrigger>
        <TableHandlePopoverContent className="relative z-10 box-border block max-h-[25rem] min-w-[8rem] select-none overflow-auto whitespace-nowrap rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950 [&:not([data-state])]:hidden">
          {state.addTableRowAbove.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.addTableRowAbove.command}
            >
              <span>Insert Above</span>
            </TableHandlePopoverItem>
          )}
          {state.addTableRowBelow.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.addTableRowBelow.command}
            >
              <span>Insert Below</span>
            </TableHandlePopoverItem>
          )}
          {state.deleteCellSelection.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.deleteCellSelection.command}
            >
              <span>Clear Contents</span>
              <span className="text-xs tracking-widest text-gray-500 dark:text-gray-500">Del</span>
            </TableHandlePopoverItem>
          )}
          {state.deleteTableRow.canExec && (
            <TableHandlePopoverItem
              className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between gap-8 whitespace-nowrap rounded px-3 py-1.5 outline-none data-[disabled=true]:pointer-events-none data-[focused]:bg-gray-100 data-[disabled=true]:opacity-50 hover:data-[disabled=true]:opacity-50 dark:data-[focused]:bg-gray-800"
              onSelect={state.deleteTableRow.command}
            >
              <span>Delete Row</span>
            </TableHandlePopoverItem>
          )}
        </TableHandlePopoverContent>
      </TableHandleRowRoot>
    </TableHandleRoot>
  );
}
