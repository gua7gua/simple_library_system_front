<template>
  <div class="donation-container">
    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <!-- 图书捐赠 -->
        <el-tab-pane label="图书捐赠" name="donate">
          <el-form
            ref="donateFormRef"
            :model="donateForm"
            :rules="donateRules"
            label-width="100px"
            style="max-width: 600px; margin: 20px auto"
          >
            <el-form-item label="捐赠人姓名" prop="donorname">
              <el-input
                v-model="donateForm.donorname"
                placeholder="请输入您的姓名"
                clearable
              />
            </el-form-item>

            <el-form-item label="联系电话" prop="donorphone">
              <el-input
                v-model="donateForm.donorphone"
                placeholder="请输入您的联系电话"
                clearable
              />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="donoremail">
              <el-input
                v-model="donateForm.donoremail"
                placeholder="请输入您的电子邮箱（选填）"
                clearable
              />
            </el-form-item>

            <el-form-item label="图书 ISBN" prop="bookisbn">
              <el-input
                v-model="donateForm.bookisbn"
                placeholder="请输入图书 ISBN"
                clearable
              />
            </el-form-item>

            <el-form-item label="书名" prop="bookname">
              <el-input
                v-model="donateForm.bookname"
                placeholder="请输入书名（选填）"
                clearable
              />
            </el-form-item>

            <el-form-item label="作者" prop="bookauthor">
              <el-input
                v-model="donateForm.bookauthor"
                placeholder="请输入作者（选填）"
                clearable
              />
            </el-form-item>

            <el-form-item label="出版社" prop="bookpublisher">
              <el-input
                v-model="donateForm.bookpublisher"
                placeholder="请输入出版社（选填）"
                clearable
              />
            </el-form-item>

            <el-form-item label="备注" prop="donorremark">
              <el-input
                v-model="donateForm.donorremark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息（如图书品相、捐赠原因等）"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="handleSubmit"
                :loading="submitLoading"
                style="width: 100%"
              >
                提交捐赠申请
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 捐赠记录 -->
        <el-tab-pane label="捐赠记录" name="records">
          <div style="padding: 20px">
            <el-form :inline="true" style="margin-bottom: 20px">
              <el-form-item label="手机号">
                <el-input
                  v-model="queryPhone"
                  placeholder="请输入手机号查询"
                  clearable
                  style="width: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :icon="Search"
                  @click="handleQuery"
                  :loading="queryLoading"
                >
                  查询
                </el-button>
              </el-form-item>
            </el-form>

            <el-table
              v-loading="queryLoading"
              :data="recordList"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="bookname" label="书名" min-width="150" show-overflow-tooltip />
              <el-table-column prop="bookauthor" label="作者" width="100" show-overflow-tooltip />
              <el-table-column prop="bookisbn" label="ISBN" width="130" />

              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ row.statustext }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column prop="applytime" label="申请时间" width="160" align="center">
                <template #default="{ row }">
                  {{ formatTime(row.applytime) }}
                </template>
              </el-table-column>

              <el-table-column prop="donorremark" label="备注" min-width="150" show-overflow-tooltip />
            </el-table>

            <el-empty
              v-if="!queryLoading && recordList.length === 0 && hasQueried"
              description="暂无捐赠记录"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { submitDonation, getDonationRecords } from '@/api/donation'

const activeTab = ref('donate')
const submitLoading = ref(false)
const queryLoading = ref(false)
const hasQueried = ref(false)

const donateFormRef = ref(null)
const donateForm = reactive({
  donorname: '',
  donorphone: '',
  donoremail: '',
  bookisbn: '',
  bookname: '',
  bookauthor: '',
  bookpublisher: '',
  donorremark: ''
})

const donateRules = {
  donorname: [
    { required: true, message: '请输入捐赠人姓名', trigger: 'blur' }
  ],
  donorphone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  donoremail: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  bookisbn: [
    { required: true, message: '请输入图书 ISBN', trigger: 'blur' }
  ]
}

const queryPhone = ref('')
const recordList = ref([])

// 提交捐赠申请
const handleSubmit = async () => {
  try {
    await donateFormRef.value.validate()
    submitLoading.value = true

    await submitDonation(donateForm)
    ElMessage.success('捐赠申请提交成功！我们会尽快与您联系')

    // 重置表单
    donateFormRef.value.resetFields()
  } catch (error) {
    if (error !== false) {
      console.error('提交捐赠申请失败:', error)
    }
  } finally {
    submitLoading.value = false
  }
}

// 查询捐赠记录
const handleQuery = async () => {
  if (!queryPhone.value) {
    ElMessage.warning('请输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(queryPhone.value)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  queryLoading.value = true
  hasQueried.value = true
  try {
    const res = await getDonationRecords(queryPhone.value)
    recordList.value = res.data || []
    if (recordList.value.length === 0) {
      ElMessage.info('未查询到捐赠记录')
    }
  } catch (error) {
    console.error('查询捐赠记录失败:', error)
    recordList.value = []
  } finally {
    queryLoading.value = false
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'primary',
    2: 'success'
  }
  return typeMap[status] || 'info'
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-'
  return time.replace('T', ' ')
}
</script>

<style scoped>
.donation-container {
  padding: 20px;
}
</style>
