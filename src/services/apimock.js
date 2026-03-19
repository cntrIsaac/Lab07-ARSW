const mockBlueprints = [
  {
    author: 'john',
    name: 'house',
    points: [
      { x: 20, y: 30 },
      { x: 80, y: 30 },
      { x: 80, y: 90 },
      { x: 20, y: 90 },
    ],
  },
  {
    author: 'john',
    name: 'garage',
    points: [
      { x: 140, y: 40 },
      { x: 220, y: 40 },
      { x: 220, y: 100 },
      { x: 140, y: 100 },
    ],
  },
  {
    author: 'jane',
    name: 'garden',
    points: [
      { x: 60, y: 150 },
      { x: 120, y: 190 },
      { x: 180, y: 150 },
      { x: 240, y: 210 },
    ],
  },
]

const clone = (value) => JSON.parse(JSON.stringify(value))

const delay = (value) => Promise.resolve(clone(value))

const apimock = {
  async getAll() {
    return delay(mockBlueprints)
  },

  async getByAuthor(author) {
    const items = mockBlueprints.filter((bp) => bp.author === author)
    return delay(items)
  },

  async getByAuthorAndName(author, name) {
    const bp = mockBlueprints.find((item) => item.author === author && item.name === name)
    if (!bp) {
      throw new Error('Blueprint not found')
    }
    return delay(bp)
  },

  async create(payload) {
    const exists = mockBlueprints.some(
      (bp) => bp.author === payload.author && bp.name === payload.name,
    )
    if (exists) {
      throw new Error('Blueprint already exists')
    }
    const bp = {
      author: payload.author,
      name: payload.name,
      points: payload.points || [],
    }
    mockBlueprints.push(bp)
    return delay(bp)
  },

  async addPoint(author, name, point) {
    const bp = mockBlueprints.find((item) => item.author === author && item.name === name)
    if (!bp) {
      throw new Error('Blueprint not found')
    }
    bp.points.push(point)
    return delay(bp)
  },

  async update(author, name, payload) {
    const index = mockBlueprints.findIndex((item) => item.author === author && item.name === name)
    if (index < 0) {
      throw new Error('Blueprint not found')
    }
    const updated = {
      author,
      name,
      points: Array.isArray(payload?.points) ? payload.points : [],
    }
    mockBlueprints[index] = updated
    return delay(updated)
  },

  async remove(author, name) {
    const index = mockBlueprints.findIndex((item) => item.author === author && item.name === name)
    if (index < 0) {
      throw new Error('Blueprint not found')
    }
    const [removed] = mockBlueprints.splice(index, 1)
    return delay(removed)
  },
}

export default apimock
