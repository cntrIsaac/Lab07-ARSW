import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import {
  deleteBlueprint,
  fetchBlueprint,
  updateBlueprint,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import { isAuthenticated } from '../services/authStorage.js'

export default function BlueprintDetailPage() {
  const { author, name } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { current: bp, status, error } = useSelector((s) => s.blueprints)
  const [draftPoints, setDraftPoints] = useState([])
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    dispatch(fetchBlueprint({ author, name }))
  }, [author, name, dispatch])

  useEffect(() => {
    setDraftPoints(bp?.points || [])
  }, [bp])

  const addDraftPoint = (point) => {
    if (!isAuthenticated()) return
    setDraftPoints((prev) => [...prev, point])
  }

  const clearDraft = () => {
    if (!isAuthenticated()) return
    setDraftPoints([])
  }

  const saveUpdate = async () => {
    setLocalError('')
    if (!isAuthenticated()) {
      setLocalError('Debes iniciar sesion para guardar cambios.')
      return
    }

    const result = await dispatch(
      updateBlueprint({
        author,
        name,
        payload: { author, name, points: draftPoints },
      }),
    )

    if (updateBlueprint.rejected.match(result)) {
      setLocalError('No se pudo actualizar el blueprint.')
    }
  }

  const removeBlueprint = async () => {
    if (!isAuthenticated()) {
      setLocalError('Debes iniciar sesion para eliminar.')
      return
    }
    const confirmed = window.confirm(`Eliminar blueprint ${author}/${name}?`)
    if (!confirmed) return

    const result = await dispatch(deleteBlueprint({ author, name }))
    if (deleteBlueprint.fulfilled.match(result)) {
      navigate('/')
      return
    }
    setLocalError('No se pudo eliminar el blueprint.')
  }

  if (!bp)
    return (
      <div className="card">
        <p>{status.current === 'loading' ? 'Cargando...' : 'No se encontro el blueprint solicitado.'}</p>
        {error.current && <p className="error-text">{error.current}</p>}
      </div>
    )

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{bp.name}</h2>
        <p>
          <strong>Autor:</strong> {bp.author}
        </p>
        <p>
          <strong>Puntos:</strong> {draftPoints.length}
        </p>
        {!isAuthenticated() && (
          <p style={{ color: '#94a3b8', marginBottom: 0 }}>
            Inicia sesion para editar y guardar este blueprint.
          </p>
        )}
        {isAuthenticated() && (
          <div className="grid" style={{ marginTop: 12, gap: 10 }}>
            <p style={{ margin: 0, color: '#94a3b8' }}>
              Haz clic en el canvas para agregar puntos y luego usa Save/Update.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn primary"
                type="button"
                onClick={saveUpdate}
                disabled={status.update === 'loading'}
              >
                {status.update === 'loading' ? 'Guardando...' : 'Save/Update'}
              </button>
              <button className="btn" type="button" onClick={clearDraft}>
                Limpiar puntos
              </button>
              <button
                className="btn"
                type="button"
                onClick={removeBlueprint}
                disabled={status.delete === 'loading'}
              >
                {status.delete === 'loading' ? 'Eliminando...' : 'Delete'}
              </button>
            </div>
            {(localError || error.update || error.delete) && (
              <p className="error-text">{localError || error.update || error.delete}</p>
            )}
          </div>
        )}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Visualizacion del plano</h3>
        <BlueprintCanvas points={draftPoints} onCanvasClick={addDraftPoint} />
      </section>
    </div>
  )
}
