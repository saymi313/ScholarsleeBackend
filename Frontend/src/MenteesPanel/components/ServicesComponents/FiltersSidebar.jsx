import React, { useEffect, useMemo, useState } from "react"
import { menteeServicesAPI } from "../../../utils/api"

const Section = ({ title, children }) => (
  <section className="border-b border-zinc-100 pb-5">
    <h3 className="font-semibold text-sm text-zinc-800 mb-3">{title}</h3>
    {children}
  </section>
)

const formatCategory = (value = "") =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase())

const priceOptions = [
  { id: "any", label: "Any budget", minPrice: null, maxPrice: null },
  { id: "under-50", label: "Under $50", minPrice: null, maxPrice: 50 },
  { id: "50-100", label: "$50 - $100", minPrice: 50, maxPrice: 100 },
  { id: "100-200", label: "$100 - $200", minPrice: 100, maxPrice: 200 },
  { id: "200-plus", label: "$200 and above", minPrice: 200, maxPrice: null }
]

const ratingOptions = [
  { id: "any-rating", label: "Any rating", value: "" },
  { id: "rating-4", label: "4.0 & above", value: "4" },
  { id: "rating-45", label: "4.5 & above", value: "4.5" },
  { id: "rating-5", label: "Only 5 stars", value: "5" }
]

const sortOptions = [
  { id: "created-desc", label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { id: "rating-desc", label: "Top rated", sortBy: "rating", sortOrder: "desc" },
  { id: "price-asc", label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { id: "price-desc", label: "Price: High to Low", sortBy: "price", sortOrder: "desc" }
]

export default function FiltersSidebar({ filters = {}, onChange, onReset }) {
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [categoriesError, setCategoriesError] = useState("")

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        setCategoriesError("")

        const response = await menteeServicesAPI.getCategories()
        const apiCategories =
          response.data?.data?.categories || response.data?.categories || []

        setCategories(apiCategories.filter(Boolean))
      } catch (error) {
        console.error("Failed to load service categories", error)
        setCategoriesError("Unable to load categories right now")
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const activePriceId = useMemo(() => {
    const min = filters.minPrice ?? null
    const max = filters.maxPrice ?? null

    const matched = priceOptions.find((option) => {
      const optionMin = option.minPrice ?? null
      const optionMax = option.maxPrice ?? null

      return optionMin === (min ?? null) && optionMax === (max ?? null)
    })

    return matched ? matched.id : "any"
  }, [filters.minPrice, filters.maxPrice])

  const activeSortId = useMemo(() => {
    const { sortBy = "createdAt", sortOrder = "desc" } = filters
    const matched = sortOptions.find(
      (option) => option.sortBy === sortBy && option.sortOrder === sortOrder
    )

    return matched ? matched.id : "created-desc"
  }, [filters])

  const handlePriceChange = (option) => {
    onChange?.({
      minPrice: option.minPrice,
      maxPrice: option.maxPrice
    })
  }

  const handleRatingChange = (value) => {
    onChange?.({ rating: value })
  }

  const handleCategoryChange = (category) => {
    const nextValue = filters.category === category ? "" : category
    onChange?.({ category: nextValue })
  }

  const handleSortChange = (option) => {
    onChange?.({ sortBy: option.sortBy, sortOrder: option.sortOrder })
  }

  return (
    <aside className="bg-white rounded-xl border border-zinc-100 p-4 md:p-5 shadow-sm">
      <div className="space-y-6">
        <Section title="Budget">
          <div className="space-y-2">
            {priceOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-3 text-sm text-zinc-700">
                <input
                  type="radio"
                  name="price-range"
                  value={option.id}
                  checked={activePriceId === option.id}
                  onChange={() => handlePriceChange(option)}
                  className="h-4 w-4 text-[#5D38DE] focus:ring-[#5D38DE] border-zinc-300"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Service Category">
          {loadingCategories ? (
            <p className="text-sm text-zinc-500">Loading categories...</p>
          ) : categoriesError ? (
            <p className="text-sm text-red-500">{categoriesError}</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-zinc-500">No categories available yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = filters.category === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      isActive
                        ? "bg-[#5D38DE] text-white border-[#5D38DE]"
                        : "border-zinc-200 text-zinc-700 hover:border-[#5D38DE] hover:text-[#5D38DE]"
                    }`}
                  >
                    {formatCategory(category)}
                  </button>
                )
              })}
            </div>
          )}
        </Section>

        <Section title="Minimum rating">
          <div className="space-y-2">
            {ratingOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-3 text-sm text-zinc-700">
                <input
                  type="radio"
                  name="rating"
                  value={option.value}
                  checked={(filters.rating || "") === option.value}
                  onChange={() => handleRatingChange(option.value)}
                  className="h-4 w-4 text-[#5D38DE] focus:ring-[#5D38DE] border-zinc-300"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Sort results">
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-3 text-sm text-zinc-700">
                <input
                  type="radio"
                  name="sort"
                  value={option.id}
                  checked={activeSortId === option.id}
                  onChange={() => handleSortChange(option)}
                  className="h-4 w-4 text-[#5D38DE] focus:ring-[#5D38DE] border-zinc-300"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </Section>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => onReset?.()}
            className="w-full h-10 rounded-md border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition"
          >
            Reset filters
          </button>
        </div>
      </div>
    </aside>
  )
}