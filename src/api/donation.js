import request from '@/utils/request'

/**
 * 提交捐赠申请
 */
export const submitDonation = (data) => {
  return request({
    url: '/donation/submit',
    method: 'post',
    data
  })
}

/**
 * 查询捐赠记录
 */
export const getDonationRecords = (phone) => {
  return request({
    url: '/donation/records',
    method: 'get',
    params: { phone }
  })
}

/**
 * 管理员查询捐赠列表
 */
export const getDonationList = (page, limit, status) => {
  return request({
    url: '/admin/donation/list',
    method: 'get',
    params: { page, limit, status }
  })
}

/**
 * 管理员查询捐赠详情
 */
export const getDonationDetail = (id) => {
  return request({
    url: `/admin/donation/${id}`,
    method: 'get'
  })
}

/**
 * 管理员更新捐赠状态
 */
export const updateDonationStatus = (id, status) => {
  return request({
    url: `/admin/donation/${id}/status`,
    method: 'put',
    data: { status }
  })
}

/**
 * 管理员更新工作人员备注
 */
export const updateDonationRemark = (id, staffremark) => {
  return request({
    url: `/admin/donation/${id}/remark`,
    method: 'put',
    data: { staffremark }
  })
}
