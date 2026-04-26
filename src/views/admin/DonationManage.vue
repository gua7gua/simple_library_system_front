<template>
  <div class="donation-manage-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="待处理" :value="0" />
            <el-option label="待接收" :value="1" />
            <el-option label="已入库" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 捐赠列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">捐赠管理</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="donationList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="donorname" label="捐赠人" width="100" />
        <el-table-column prop="donorphone" label="联系电话" width="120" />
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

        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="捐赠详情"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="detailForm" label-width="100px">
        <el-form-item label="捐赠人">
          <el-input v-model="detailForm.donorname" disabled />
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="detailForm.donorphone" disabled />
        </el-form-item>

        <el-form-item label="电子邮箱">
          <el-input v-model="detailForm.donoremail" disabled />
        </el-form-item>

        <el-form-item label="书名">
          <el-input v-model="detailForm.bookname" disabled />
        </el-form-item>

        <el-form-item label="作者">
          <el-input v-model="detailForm.bookauthor" disabled />
        </el-form-item>

        <el-form-item label="出版社">
          <el-input v-model="detailForm.bookpublisher" disabled />
        </el-form-item>

        <el-form-item label="ISBN">
          <el-input v-model="detailForm.bookisbn" disabled />
        </el-form-item>

        <el-form-item label="申请时间">
          <el-input :value="formatTime(detailForm.applytime)" disabled />
        </el-form-item>

        <el-form-item label="联系时间" v-if="detailForm.contacttime">
          <el-input :value="formatTime(detailForm.contacttime)" disabled />
        </el-form-item>

        <el-form-item label="接收时间" v-if="detailForm.receivetime">
          <el-input :value="formatTime(detailForm.receivetime)" disabled />
        </el-form-item>

        <el-form-item label="捐赠人备注">
          <el-input
            v-model="detailForm.donorremark"
            type="textarea"
            :rows="2"
            disabled
          />
        </el-form-item>

        <el-form-item label="当前状态">
          <el-select v-model="detailForm.status" placeholder="请选择状态">
            <el-option label="待处理" :value="0" />
            <el-option label="待接收" :value="1" />
            <el-option label="已入库" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="工作人员备注">
          <el-input
            v-model="detailForm.staffremark"
            type="textarea"
            :rows="3"
            placeholder="请输入工作人员备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="detailDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate" :loading="updateLoading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getDonationList,
  getDonationDetail,
  updateDonationStatus,
  updateDonationRemark
} from '@/api/donation'

const loading = ref(false)
const updateLoading = ref(false)
const donationList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = ref({
  status: undefined
})

const detailDialogVisible = ref(false)
const detailForm = ref({})
const originalStatus = ref(0)

onMounted(() => {
  fetchDonationList()
})

// 获取捐赠列表
const fetchDonationList = async () => {
  loading.value = true
  try {
    const res = await getDonationList(
      currentPage.value,
      pageSize.value,
      searchForm.value.status
    )
    donationList.value = res.data || []
    total.value = res.count || 0
  } catch (error) {
    console.error('获取捐赠列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchDonationList()
}

// 重置
const handleReset = () => {
  searchForm.value.status = undefined
  currentPage.value = 1
  fetchDonationList()
}

// 分页
const handleSizeChange = () => {
  currentPage.value = 1
  fetchDonationList()
}

const handleCurrentChange = () => {
  fetchDonationList()
}

// 查看详情
const handleDetail = async (row) => {
  try {
    const res = await getDonationDetail(row.donationid)
    detailForm.value = res.data || {}
    originalStatus.value = detailForm.value.status
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取捐赠详情失败:', error)
  }
}

// 更新捐赠信息
const handleUpdate = async () => {
  updateLoading.value = true
  try {
    // 更新状态
    if (detailForm.value.status !== originalStatus.value) {
      await updateDonationStatus(detailForm.value.donationid, detailForm.value.status)
    }

    // 更新备注
    if (detailForm.value.staffremark) {
      await updateDonationRemark(detailForm.value.donationid, detailForm.value.staffremark)
    }

    ElMessage.success('更新成功')
    detailDialogVisible.value = false
    fetchDonationList()
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    updateLoading.value = false
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  detailForm.value = {}
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
.donation-manage-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
