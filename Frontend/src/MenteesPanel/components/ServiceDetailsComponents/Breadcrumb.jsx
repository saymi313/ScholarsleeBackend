import React from "react"
import { Link } from "react-router-dom"

export default function Breadcrumb({ service }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/mentees/services" className="hover:text-foreground text-[#5D38DE] underline-offset-4 hover:underline">
            Services
          </Link>
        </li>
        <li aria-hidden="true" className="text-foreground/30">
          /
        </li>
        <li className="text-foreground">
          {service ? service.category : 'Service Details'}
        </li>
      </ol>
    </nav>
  )
}
  