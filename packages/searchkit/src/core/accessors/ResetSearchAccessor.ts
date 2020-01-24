import { Accessor, FilterBasedAccessor, PaginationAccessor } from './'
const each = require('lodash/each')

export interface ResetSearchOptions {
  query?: boolean
  filter?: boolean
  pagination?: boolean
}

export class ResetSearchAccessor extends Accessor {
  constructor(
    public options: ResetSearchOptions = { query: true, filter: true, pagination: true }
  ) {
    super()
  }

  canReset() {
    const query = this.searchkit.query
    const options = this.options
    return (
      (options.pagination && query.getFrom() > 0) ||
      (options.query && query.getQueryString().length > 0) ||
      (options.filter && query.getSelectedFilters().length > 0)
    )
  }

  performReset() {
    const query = this.searchkit.query
    if (this.options.query) {
      this.searchkit.getQueryAccessor().resetState()
    }
    if (this.options.filter) {
      const filters = this.searchkit.getAccessorsByType(FilterBasedAccessor)
      each(filters, (accessor) => accessor.resetState())
      each(query.getSelectedFilters() || [], (f) => f.remove())
    }
    const paginationAccessor = this.searchkit.getAccessorByType(PaginationAccessor)
    if (this.options.pagination && paginationAccessor) {
      paginationAccessor.resetState()
    }
  }
}
