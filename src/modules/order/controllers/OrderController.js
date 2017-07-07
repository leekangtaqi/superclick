export default class OrderController {
  async order(ctx, next){
    // 是否定过了
    // yes - 返回
    // no - 去定
    // 活动状态是否可用？
    // yes - 
      // 需要预定？
        // yes - 
          //预定过了？
            // yes - 放入计划中 
            // no - 去预定
        // no - 放入计划中 
    // no - 返回
    ctx.body = 'Hello World'
  }

  
}