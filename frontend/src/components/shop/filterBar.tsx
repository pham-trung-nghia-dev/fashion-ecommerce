"use client"

import { SlidersHorizontal, LayoutGrid, List } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FilterBar = ({ totalResults }: { totalResults: number }) => {
  return (
    <div className="bg-[#F9F1E7] py-8 px-4 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
          <SlidersHorizontal size={20} />
          <span className="text-xl font-medium">Filter</span>
        </div>
        <div className="flex gap-4">
          <LayoutGrid className="cursor-pointer" />
          <List className="cursor-pointer" />
        </div>
        <Separator orientation="vertical" className="h-8 bg-[#9F9F9F] hidden md:block" />
        <p className="text-base">
          Showing 1–16 of {totalResults} results
        </p>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4">
          <span className="text-xl">Show</span>
          <Select defaultValue="16">
            <SelectTrigger className="w-[55px] h-[55px] bg-white border-none rounded-none text-[#9F9F9F]">
              <SelectValue placeholder="16" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="32">32</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xl">Short by</span>
          <Select defaultValue="default">
            <SelectTrigger className="w-[188px] h-[55px] bg-white border-none rounded-none text-[#9F9F9F]">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar