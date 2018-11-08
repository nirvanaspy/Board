<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="searchQuery">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;float:right;" @click="handleCreate" type="success" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              :default-sort = "{prop: 'createTime', order: 'descending'}"
              style="width: 100%">
      <el-table-column align="left" label="IP" min-width="200">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="名称" min-width="200">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="部门" min-width="200">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.department}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="类型" min-width="200">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="100" sortable prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200">
        <template slot-scope="scope">
          <el-dropdown trigger="click" v-if="!scope.row.deleted">
            <span class="el-dropdown-link" v-if="!scope.row.virtual">
              <el-button type="success" plain>更多操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span style="display:inline-block;padding:0 10px;" @click="handleUpdate(scope.row)">编辑</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleDelete(scope.row)">删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20,50,100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
      background
      style="text-align: center;margin-top:20px"
    >
    </el-pagination>

    <!--新增修改对话框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="deployRules" ref="dataForm" :model="temp" label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="temp.ip"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="temp.department"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="temp.type"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" style="margin-right: 10px">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="creDepLoading">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData" :loading="upDepLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { boardsList, createBoard, updateBoard, deleteBoard } from '@/api/board'
  import waves from '@/directive/waves' // 水波纹指令
  import Sortable from 'sortablejs'

  /* eslint-disable */
  export default {
    name: 'boardManage',
    directives: {
      waves
    },
    data() {
      return {
        selectedId: '',
        tableKey: 0,
        list: [],
        listLoading: true,
        listQuery: {
          page: 0,
          size:20,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        sortable: null,
        newList: [],
        temp: {
          id: '',
          ip: '',
          name: '',
          department: '',
          type: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        deployRules: {
          ip: [{ required: true, message: '请输入IP', trigger: 'blur' }],
          name: [{ required: true, message: '请输入看板名称', trigger: 'blur' }],
          department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
          type: [{ required: true, message: '请输入类型', trigger: 'blur' }]
        },
        downloadLoading: false,
        creDepLoading: false,
        upDepLoading: false,
        creBasLoading: false,
        upBasLoading: false,
        searchQuery: '',
        errorMessage: '操作失败！'
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;

        boardsList(this.listQuery).then(response => {
          this.list = response.data.data.content
          this.total = response.data.total
          this.listLoading = false
          this.listLength = response.data.data.length
          this.total = response.data.data.totalElements
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.pagesize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.currentPage = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          ip: '',
          name: '',
          department: '',
          type: ''
        }
      },
      resetBaseLineTemp() {
        this.baselineTemp = {
          id: '',
          name: '',
          description: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creDepLoading = true
            let formData = new FormData();

            formData.append('ip', this.temp.ip);
            formData.append('name', this.temp.name);
            formData.append('department', this.temp.department);
            formData.append('type', this.temp.type);

            createBoard(formData).then(() => {
              this.list.unshift(this.temp)
              this.creDepLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.errorMessage = '操作失败！'
              this.creDepLoading = false
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '创建失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.selectedId = row.id;

        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        let qs = require('qs');
        this.$refs['dataForm'].validate((valid) => {
          this.upDepLoading = true
          if (valid) {
            let data = {
              'ip': this.temp.ip,
              'name': this.temp.name,
              'department': this.temp.department,
              'type': this.temp.type
            };

            const id = this.selectedId;

            let deployplanData = qs.stringify(data);
            updateBoard(deployplanData, id).then(() => {
              this.upDepLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) =>{
              this.upDepLoading = false
              this.errorMessage = '操作失败！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '修改失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })

          }
        })
      },
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },
      handleDelete(row) {
        let id = row.id;
        this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBoard(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败！',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    computed: {
      listA: function () {
        let self = this;
        return self.list.filter(function (item) {
          return item.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !== -1;
        })
      }
    }
  }
</script>
<style scoped>

</style>
