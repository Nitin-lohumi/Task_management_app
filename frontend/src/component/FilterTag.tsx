import { useState } from "react";
import {
  Select,
  FormControl,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  ListSubheader,
  Box,
} from "@mui/material";

const FilterTag = ({
  tagsOption = ["Common"],
  setFilterValue,
}: {
  tagsOption: any[];
  setFilterValue: ({ tags, sort }: { tags: string[]; sort: number }) => void;
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isSort, setIsSort] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClearFilter = () => {
    setSelectedValues([]);
    setIsSort(false);
    setFilterValue({ tags: [], sort: 0 });
  };
  console.log(tagsOption);
  const handleSearch = () => {
    setOpen(false);
    setFilterValue({
      tags: selectedValues.filter(
        (v) => v.toLowerCase() !== "Sort By Status".toLowerCase()
      ),
      sort: isSort ? -1 : 0,
    });
  };

  return (
    <FormControl fullWidth className="!mt-2">
      <InputLabel id="multi-select-label">Filters</InputLabel>
      <Select
        labelId="multi-select-label"
        label="filter"
        multiple
        value={selectedValues}
        open={open}
        onOpen={() => setOpen(true)}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedValues(
            typeof value === "string" ? value.split(",") : value
          );
        }}
        onClose={() => setOpen(false)}
        renderValue={(selected) => (selected as string[]).join(", ")}
      >
        <Box className="!w-full !flex !justify-end !p-2 !gap-2">
          <button
            className="pl-4 pr-4 p-2 rounded-xl font-bold bg-blue-600 text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleSearch();
            }}
          >
            Search
          </button>
          <button
            className="pl-4 pr-4 p-2 rounded-xl font-bold bg-yellow-400 text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleClearFilter();
            }}
          >
            Clear
          </button>
        </Box>

        {/* Sort */}
        <ListSubheader disableSticky>
          <p className="text-xl font-bold p-2 text-start border-b">Sort</p>
        </ListSubheader>

        <MenuItem
          value="Sort By status"
          onClick={(e) => {
            e.stopPropagation();
            setIsSort((prev) => !prev);
          }}
        >
          <Checkbox checked={isSort} />
          <ListItemText primary="Sort By Status" />
        </MenuItem>

        {/* Tags */}
        <ListSubheader disableSticky>
          <p className="text-xl font-bold p-2 text-start border-b mb-2">
            Search By Tags
          </p>
        </ListSubheader>

        <Box className="!p-0 !m-0">
          <div className="grid grid-cols-4 gap-4 w-full p-2">
            {tagsOption.map((value: any, i: number) => (
              <div
                key={i}
                className="flex shadow-sm rounded-xl p-1 cursor-pointer flex-wrap items-center"
                onClick={() => {
                  if (!value.tag) return;
                  setSelectedValues((prev) =>
                    prev.includes(value.tag)
                      ? prev.filter((v) => v !== value.tag)
                      : [...prev, value.tag]
                  );
                }}
              >
                <Checkbox checked={selectedValues.includes(value.tag)} />
                <ListItemText primary={value.tag} />
              </div>
            ))}
          </div>
        </Box>
      </Select>
    </FormControl>
  );
};

export default FilterTag;
