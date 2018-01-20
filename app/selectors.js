//
// Copyright (c) 2017 Nathan Fiedler
//

/**
 * Returns an object containing the lists of the selected attributes.
 *
 * {
 *   locations: [location objects...],
 *   tags: [tag objects...],
 *   years: [year objects...]
 * }
 */
exports.getSelectedAttrs = (state) => {
  const locations = []
  state.locations.items.forEach((item) => {
    if (item.active) {
      locations.push(item)
    }
  })
  const tags = []
  state.tags.items.forEach((item) => {
    if (item.active) {
      tags.push(item)
    }
  })
  const years = []
  state.years.items.forEach((item) => {
    if (item.active) {
      years.push(item)
    }
  })
  return {
    locations,
    tags,
    years
  }
}
