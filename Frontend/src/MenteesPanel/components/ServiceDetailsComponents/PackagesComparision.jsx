import React from "react"

export default function PackagesComparison({ service }) {
  if (!service || !service.packages || service.packages.length === 0) {
    return (
      <section aria-labelledby="compare-heading" className="space-y-4">
        <h3 id="compare-heading" className="text-lg font-semibold text-foreground">
          Compare Packages
        </h3>
        <p className="text-muted-foreground">No packages available for comparison.</p>
      </section>
    )
  }

  // Create columns from service packages
  const columns = service.packages.map((pkg, index) => ({
    key: pkg.name.toLowerCase(),
    title: pkg.name,
    price: `$${pkg.price}`,
    desc: `${pkg.name} package - ${pkg.duration}`,
  }))

  // Create comparison rows based on package features
  const getFeatureValue = (pkg, feature) => {
    if (pkg.features && pkg.features.includes(feature)) {
      return true
    }
    return false
  }

  const getNumericValue = (pkg, type) => {
    switch (type) {
      case 'calls':
        return pkg.calls || 0
      case 'duration':
        return pkg.duration || 'N/A'
      default:
        return 'N/A'
    }
  }

  const rows = [
    { label: "Number of calls", values: service.packages.map(pkg => getNumericValue(pkg, 'calls')) },
    { label: "Duration", values: service.packages.map(pkg => getNumericValue(pkg, 'duration')) },
    { label: "Features included", values: service.packages.map(pkg => pkg.features ? pkg.features.length : 0) },
  ]
  
  function Check({ on }) {
    return on === true ? (
      <svg className="mx-auto h-4 w-4 text-[color:var(--brand,#5D38DE)]" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ) : on === false ? (
      <svg className="mx-auto h-4 w-4 text-foreground/30" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <circle cx="10" cy="10" r="2" />
      </svg>
    ) : (
      <span className="block text-center text-sm text-foreground">{on}</span>
    )
  }
  
  return (
    <section aria-labelledby="compare-heading" className="space-y-4">
      <h3 id="compare-heading" className="text-lg font-semibold text-foreground">
        Compare Packages
      </h3>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-[720px] w-full border-collapse">
          <thead>
            <tr className="bg-accent/30">
              <th className="w-40 p-4 text-left text-foreground/70 font-medium">Package</th>
              {columns.map((c) => (
                <th key={c.key} className="p-4 text-left align-bottom">
                  <div className="text-[color:var(--brand,#5D38DE)] font-semibold">{c.price}</div>
                  <div className="text-foreground font-semibold">{c.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wide">{c.title} Promo</div>
                  <p className="mt-1 text-sm text-muted-foreground max-w-xs">{c.desc}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-4 text-sm text-muted-foreground">{r.label}</td>
                {r.values.map((v, idx) => (
                  <td key={idx} className="p-4">
                    <Check on={v} />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t">
              <td className="p-4 text-sm text-muted-foreground">Total</td>
              {columns.map((c) => (
                <td key={c.key} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{c.price}</span>
                    <button
                      className="rounded-md px-4 py-2 text-sm font-medium text-white"
                      style={{ backgroundColor: "var(--brand, #5D38DE)" }}
                    >
                      Select
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
  