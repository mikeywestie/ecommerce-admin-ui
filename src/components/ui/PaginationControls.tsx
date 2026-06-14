import Button from "./Button";

type PaginationControlsProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  itemLabel?: string;
};

export default function PaginationControls({
  page,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 30],
  onPageChange,
  onPageSizeChange,
  itemLabel = "items",
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing <span className="font-semibold text-white">{start}</span>-
        <span className="font-semibold text-white">{end}</span> of{" "}
        <span className="font-semibold text-white">{totalItems}</span> {itemLabel}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2">
          <span className="text-slate-400">Rows</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
          >
            Previous
          </Button>

          <span className="min-w-24 text-center text-slate-400">
            Page {safePage} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="secondary"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
