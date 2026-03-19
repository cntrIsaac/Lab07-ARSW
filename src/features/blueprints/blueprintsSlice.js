import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const blueprints = await blueprintsService.getAll()
  const authors = [...new Set(blueprints.map((bp) => bp.author))]
  return authors
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const data = await blueprintsService.getByAuthor(author)
  return { author, items: data }
})

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    const data = await blueprintsService.getByAuthorAndName(author, name)
    return data
  },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  const data = await blueprintsService.create(payload)
  return data
})

export const appendPoint = createAsyncThunk(
  'blueprints/appendPoint',
  async ({ author, name, point }) => {
    const data = await blueprintsService.addPoint(author, name, point)
    return data
  },
)

export const updateBlueprint = createAsyncThunk(
  'blueprints/updateBlueprint',
  async ({ author, name, payload }) => {
    const data = await blueprintsService.update(author, name, payload)
    return data
  },
)

export const deleteBlueprint = createAsyncThunk(
  'blueprints/deleteBlueprint',
  async ({ author, name }) => {
    await blueprintsService.remove(author, name)
    return { author, name }
  },
)

const initialState = {
  authors: [],
  byAuthor: {},
  current: null,
  status: {
    authors: 'idle',
    byAuthor: 'idle',
    current: 'idle',
    create: 'idle',
    appendPoint: 'idle',
    update: 'idle',
    delete: 'idle',
  },
  error: {
    authors: null,
    byAuthor: null,
    current: null,
    create: null,
    appendPoint: null,
    update: null,
    delete: null,
  },
}

const slice = createSlice({
  name: 'blueprints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => {
        s.status.authors = 'loading'
        s.error.authors = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status.authors = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status.authors = 'failed'
        s.error.authors = a.error.message
      })
      .addCase(fetchByAuthor.pending, (s) => {
        s.status.byAuthor = 'loading'
        s.error.byAuthor = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.status.byAuthor = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.status.byAuthor = 'failed'
        s.error.byAuthor = a.error.message
      })
      .addCase(fetchBlueprint.pending, (s) => {
        s.status.current = 'loading'
        s.error.current = null
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.status.current = 'succeeded'
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.status.current = 'failed'
        s.error.current = a.error.message
      })
      .addCase(createBlueprint.pending, (s) => {
        s.status.create = 'loading'
        s.error.create = null
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        s.status.create = 'succeeded'
        const bp = a.payload
        if (!s.byAuthor[bp.author]) {
          s.byAuthor[bp.author] = []
        }
        s.byAuthor[bp.author].push(bp)
        if (!s.authors.includes(bp.author)) {
          s.authors.push(bp.author)
        }
      })
      .addCase(createBlueprint.rejected, (s, a) => {
        s.status.create = 'failed'
        s.error.create = a.error.message
      })
      .addCase(appendPoint.pending, (s) => {
        s.status.appendPoint = 'loading'
        s.error.appendPoint = null
      })
      .addCase(appendPoint.fulfilled, (s, a) => {
        s.status.appendPoint = 'succeeded'
        s.current = a.payload

        const authorItems = s.byAuthor[a.payload.author]
        if (!authorItems) return
        const itemIndex = authorItems.findIndex((item) => item.name === a.payload.name)
        if (itemIndex >= 0) {
          authorItems[itemIndex] = a.payload
        }
      })
      .addCase(appendPoint.rejected, (s, a) => {
        s.status.appendPoint = 'failed'
        s.error.appendPoint = a.error.message
      })
      .addCase(updateBlueprint.pending, (s) => {
        s.status.update = 'loading'
        s.error.update = null
      })
      .addCase(updateBlueprint.fulfilled, (s, a) => {
        s.status.update = 'succeeded'
        s.current = a.payload

        const authorItems = s.byAuthor[a.payload.author]
        if (!authorItems) return
        const itemIndex = authorItems.findIndex((item) => item.name === a.payload.name)
        if (itemIndex >= 0) {
          authorItems[itemIndex] = a.payload
        }
      })
      .addCase(updateBlueprint.rejected, (s, a) => {
        s.status.update = 'failed'
        s.error.update = a.error.message
      })
      .addCase(deleteBlueprint.pending, (s) => {
        s.status.delete = 'loading'
        s.error.delete = null
      })
      .addCase(deleteBlueprint.fulfilled, (s, a) => {
        s.status.delete = 'succeeded'
        const { author, name } = a.payload
        const authorItems = s.byAuthor[author] || []
        s.byAuthor[author] = authorItems.filter((item) => item.name !== name)
        if (!s.byAuthor[author].length) {
          delete s.byAuthor[author]
          s.authors = s.authors.filter((item) => item !== author)
        }
        if (s.current?.author === author && s.current?.name === name) {
          s.current = null
        }
      })
      .addCase(deleteBlueprint.rejected, (s, a) => {
        s.status.delete = 'failed'
        s.error.delete = a.error.message
      })
  },
})

export const selectBlueprintsState = (state) => state.blueprints

export const selectTopFiveBlueprintsByPoints = createSelector(
  [selectBlueprintsState],
  (blueprintsState) => {
    const all = Object.values(blueprintsState.byAuthor).flat()
    return [...all]
      .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
      .slice(0, 5)
  },
)

export default slice.reducer
