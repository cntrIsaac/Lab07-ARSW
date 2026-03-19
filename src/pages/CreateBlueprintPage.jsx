import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlueprint } from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function CreateBlueprintPage() {
  const dispatch = useDispatch()
  const createStatus = useSelector((state) => state.blueprints.status.create)
  const createError = useSelector((state) => state.blueprints.error.create)
  const [author, setAuthor] = useState('')
  const [name, setName] = useState('')
  const [points, setPoints] = useState([])
  const [formError, setFormError] = useState('')

  const addPoint = (point) => {
    setPoints((prev) => [...prev, point])
  }

  const resetPoints = () => {
    setPoints([])
  }

  const submit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!author.trim() || !name.trim()) {
      setFormError('Debes ingresar autor y nombre.')
      return
    }
    if (!points.length) {
      setFormError('Debes agregar al menos un punto en el canvas.')
      return
    }

    const result = await dispatch(
      createBlueprint({
        author: author.trim(),
        name: name.trim(),
        points,
      }),
    )

    if (createBlueprint.fulfilled.match(result)) {
      setName('')
      setPoints([])
      setFormError('')
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Crear Blueprint</h2>
        <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
          <div>
            <label htmlFor="create-author">Autor</label>
            <input
              id="create-author"
              className="input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="john"
            />
          </div>
          <div>
            <label htmlFor="create-name">Nombre</label>
            <input
              id="create-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="house-v2"
            />
          </div>
          <p style={{ margin: 0, color: '#94a3b8' }}>
            Haz click en el canvas para agregar puntos. Puntos actuales: {points.length}
          </p>
          {(formError || createError) && <p className="error-text">{formError || createError}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn primary" type="submit" disabled={createStatus === 'loading'}>
              {createStatus === 'loading' ? 'Guardando...' : 'Guardar blueprint'}
            </button>
            <button className="btn" type="button" onClick={resetPoints}>
              Limpiar puntos
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Lienzo de dibujo</h3>
        <BlueprintCanvas points={points} onCanvasClick={addPoint} />
      </section>
    </div>
  )
}
