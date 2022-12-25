// 导入 request 模块
const request = require('request')

// 自动匹配运单号所属的物流公司
function autoComNumber(orderno) {
  const url = `https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${orderno}`
  const options = {
    url: `https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${orderno}`,
    headers: {
      // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      // 'Accept-Encoding': 'gzip, deflate, br',
      // 'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8,pt;q=0.7',
      // 'Cache-Control':'max-age=0',
      // 'Connection':'keep-alive',
      'Cookie': 'WWWID=WWWD6FB8DC29C5B3E2F5475F669ADF31F0D; BAIDU_SSP_lcr=https://www.baidu.com/link?url=Vg1O5hYcHyxjit3onIoluNt72uYVmjf20SNUPoi5LAJLwbrJWZrMs2DAnbJidse_&wd=&eqid=c7696db0002b6240000000026105d9eb; Hm_lvt_22ea01af58ba2be0fec7c11b25e88e6c=1627746086,1627772365,1627773307,1627773424; Hm_lpvt_22ea01af58ba2be0fec7c11b25e88e6c=1627773461',
      // 'Host':'www.kuaidi100.com',
      // 'sec-ch-ua':'"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      // 'sec-ch-ua-mobile':'?0',
      // 'Sec-Fetch-Dest':'document',
      // 'Sec-Fetch-Mode':'navigate',
      // 'Sec-Fetch-Site':'none',
      // 'Sec-Fetch-User':'?1',
      // 'Upgrade-Insecure-Requests':'1',
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    }
  };
  return new Promise(function(resolve, reject) {
    request(options, (err, response, body) => {
      if (err) return reject({ status: 500, msg: err.message })
      console.log(body)
      // resolve(body)
      // console.log(body.num)
      body = JSON.parse(body)
      if (body.auto.length <= 0) return reject({ status: 501, msg: '无对应的物流公司' })
      resolve({ status: 200, msg: body.auto[0], comCode: body.auto[0].comCode })
    })
  })
}

async function getLogisticsInfo(req, res) {
  const result = await autoComNumber(req.params.orderno)

  if (result.status !== 200) {
    return {
      meta: {
        status: 500,
        message: '获取物流信息失败！'
      }
    }
  }

  const dataUrl = `https://www.kuaidi100.com/query?type=${result.comCode}&postid=${req.params.orderno}&temp=0.2595247267684455`
  console.log(dataUrl)
  request(dataUrl, (err, response, body) => {
    if (err) {
      return res.send({
        meta: {
          status: 501,
          message: '获取物流信息失败！'
        }
      })
    }
    console.log("===================================")
    console.log(body)
    console.log("===================================")
    // 获取物流信息成功
    return res.send({
      meta: {
        status: 200,
        message: '获取物流信息成功！'
      },
      data: (JSON.parse(body)).data
    })
  })
}

module.exports = {
  getLogisticsInfo
}
