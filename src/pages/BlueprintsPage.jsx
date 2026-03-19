import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteBlueprint,
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
  selectTopFiveBlueprintsByPoints,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, status, error } = useSelector((s) => s.blueprints)
  const topFive = useSelector(selectTopFiveBlueprintsByPoints)
  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const items = byAuthor[selectedAuthor] || []

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    if (!authorInput) return
    setSelectedAuthor(authorInput)
    dispatch(fetchByAuthor(authorInput))
  }

  const openBlueprint = (bp) => {
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  const deleteFromList = async (bp) => {
    const confirmed = window.confirm(`Eliminar blueprint ${bp.author}/${bp.name}?`)
    if (!confirmed) return
    await dispatch(deleteBlueprint({ author: bp.author, name: bp.name }))
  }

  const retryCurrentAuthor = () => {
    if (!selectedAuthor) return
    dispatch(fetchByAuthor(selectedAuthor))
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.1fr 1.4fr', gap: 24 }}>
      <section className="grid" style={{ gap: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Blueprints</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input"
              placeholder="Author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
            />
            <button className="btn primary" onClick={getBlueprints}>
              Get blueprints
            </button>
          </div>
          {status.authors === 'loading' && <p style={{ marginBottom: 0 }}>Cargando autores...</p>}
          {error.authors && <p className="error-text">Error cargando autores: {error.authors}</p>}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
          </h3>
          {status.byAuthor === 'loading' && <p>Cargando resultados...</p>}
          {error.byAuthor && (
            <div className="alert error" role="alert">
              <p style={{ margin: 0 }}>No se pudo consultar el autor: {error.byAuthor}</p>
              <button className="btn" style={{ marginTop: 10 }} onClick={retryCurrentAuthor}>
                Reintentar
              </button>
            </div>
          )}
          {!items.length && status.byAuthor !== 'loading' && !error.byAuthor && <p>Sin resultados.</p>}
          {!!items.length && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px',
                        borderBottom: '1px solid #334155',
                      }}
                    >
                      Blueprint name
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '8px',
                        borderBottom: '1px solid #334155',
                      }}
                    >
                      Number of points
                    </th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((bp) => (
                    <tr key={bp.name}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>
                        {bp.name}
                      </td>
                      <td
                        style={{
                          padding: '8px',
                          textAlign: 'right',
                          borderBottom: '1px solid #1f2937',
                        }}
                      >
                        {bp.points?.length || 0}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>
                        <button className="btn" onClick={() => openBlueprint(bp)}>
                          Open
                        </button>
                        <button className="btn" onClick={() => deleteFromList(bp)} style={{ marginLeft: 8 }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginTop: 12, fontWeight: 700 }}>Total user points: {totalPoints}</p>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Top 5 blueprints por puntos</h3>
          {!topFive.length && <p style={{ marginBottom: 0 }}>Sin datos todavía.</p>}
          {!!topFive.length && (
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {topFive.map((bp) => (
                <li key={`${bp.author}:${bp.name}`}>
                  {bp.author} / {bp.name} ({bp.points?.length || 0} puntos)
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Current blueprint: {current?.name || '—'}</h3>
        {status.current === 'loading' && <p>Cargando blueprint...</p>}
        {error.current && <p className="error-text">Error abriendo blueprint: {error.current}</p>}
        <BlueprintCanvas points={current?.points || []} />
      </section>
    </div>
  )
}
