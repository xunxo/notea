import { api } from 'libs/server/api'
import { jsonToMeta, metaToJson } from 'libs/server/meta'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getPathNoteById } from 'libs/server/note-path'
import { NOTE_DELETED } from 'libs/shared/meta'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const id = req.body.id || req.query.id
    const notePath = getPathNoteById(id)
    const oldMeta = await req.store.getObjectMeta(notePath)
    const oldMetaJson = metaToJson(oldMeta)
    let meta = jsonToMeta({
      ...req.body,
      date: new Date().toISOString(),
    })

    if (oldMeta) {
      meta = new Map([...oldMeta, ...meta])

      // 处理删除情况
      const { deleted } = req.body
      if (oldMetaJson.deleted !== deleted && deleted === NOTE_DELETED.DELETED) {
        await req.treeStore.removeItem(id)
      }
    }

    await req.store.copyObject(notePath, notePath, {
      meta,
      contentType: 'text/markdown',
    })

    res.status(204).end()
  })
  .get(async (req, res) => {
    const id = req.body.id || req.query.id
    const notePath = getPathNoteById(id)
    const meta = await req.store.getObjectMeta(notePath)

    res.json(metaToJson(meta))
  })
