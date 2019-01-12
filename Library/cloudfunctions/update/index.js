// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.bookNumber - event.number > 0) {

      return await db.collection('publish').doc(event.id).update({
        data: {
          bookNumber: (event.bookNumber-event.number)
        }
      })
    } else {
      return await db.collection('publish').doc(event.id).remove()
    }
  } catch(e) {
    console.error(e)
  }




}