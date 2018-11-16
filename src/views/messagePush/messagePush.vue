<template>
  <div class="app-container calendar-list-container mesPush">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称"
                v-model="searchQuery">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;float:right;" @click="handleMessage" type="success">
        <svg-icon icon-class="send" style="margin-right: 10px;"></svg-icon>
        推送消息
      </el-button>
    </div>

    <el-table :key='tableKey' :data="listA" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              :default-sort="{prop: 'createTime', order: 'descending'}"
              @selection-change="handleSelectionChange"
              style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="left" label="IP" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="名称" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="部门" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.department}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="类型" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="100" sortable prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" :label="$t('table.actions')" width="200">
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
              <el-dropdown-item divided>
                <span style="display:inline-block;padding:0 10px;" @click="handleLayout(scope.row)">看板布局</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>-->
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

    <!--设置推送内容-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :model="temp" label-width="100px" style='width: 80%; margin:0 auto;'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="滚动方向">
              <el-select v-model="mesDirection" placeholder="请选择">
                <el-option
                  v-for="item in directionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">
            <el-form-item label="字幕位置">
              <el-select v-model="mesPosition" placeholder="请选择">
                <el-option
                  v-for="item in positionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="字体属性">
              <el-select v-model="mesFont" placeholder="请选择">
                <el-option
                  v-for="item in mesFonts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示时长">
              <el-input-number v-model="duration" :precision="1" :step="0.5" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="滚动速度">
              <el-input-number v-model="speed" :step="1" :max="10" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">
            <el-form-item label="滚动次数">
              <el-input-number v-model="rollTime" :step="1" :max="10" :min="0"></el-input-number>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="消息内容" prop="content">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="temp.content">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择图片" prop="content">
              <el-button type="primary" disabled="disabled">选择</el-button>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" style="margin-right: 10px">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="savePush" :loading="creDepLoading">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { pushMessage } from '@/api/messagePush'
  import { boardsList, updateBoard, deleteBoard } from '@/api/board'
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
        directionOptions: [
          {
            value: 'top',
            label: '向上'
          }, {
            value: 'bottom',
            label: '向下'
          }, {
            value: 'left',
            label: '向左'
          }, {
            value: 'right',
            label: '向右'
          }
        ],
        positionOptions: [
          {
            value: 'top',
            label: '上'
          }, {
            value: 'bottom',
            label: '下'
          }, {
            value: 'left',
            label: '左'
          }, {
            value: 'right',
            label: '右'
          }
        ],
        mesFonts: [
          {
            value: '微软雅黑',
            label: '微软雅黑'
          }, {
            value: '宋体',
            label: '宋体'
          }, {
            value: '楷体',
            label: '楷体'
          }
        ],
        mesFont: '微软雅黑',
        duration: 1,
        speed: 1,
        rollTime: 1,
        mesDirection: '',
        mesPosition: '',
        selectedId: '',
        selectedBoardIds: '',
        tableKey: 0,
        list: [],
        listLoading: true,
        listQuery: {
          page: 0,
          size: 20,
          limit: 5,
          tagname: ''
        },
        total: null,
        pagesize: 10,//每页的数据条数
        currentPage: 1,//默认开始页面
        sortable: null,
        newList: [],
        temp: {
          id: '',
          ip: '',
          name: '',
          department: '',
          type: '',
          content: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '设置消息内容'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        deployRules: {
          ip: [{required: true, message: '请输入IP', trigger: 'blur'}],
          name: [{required: true, message: '请输入看板名称', trigger: 'blur'}],
          department: [{required: true, message: '请输入部门', trigger: 'blur'}],
          type: [{required: true, message: '请输入类型', trigger: 'blur'}]
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
      savePush() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.creDepLoading = true
            let formData = new FormData();

            let ids = this.selectedBoardIds;
            let direction = this.mesDirection;
            let font = this.mesFont;
            let duration = this.duration;
            let speed = this.speed;
            let content = this.temp.content;

            console.log(ids)
            console.log(direction)
            console.log(font)
            console.log(duration)
            console.log(speed)
            console.log(content)
            formData.append('boardIds', ids);
            formData.append('direction', direction);
            formData.append('font', font);
            formData.append('duration', duration);
            formData.append('speed', speed);
            formData.append('content', content);

            pushMessage(formData).then(() => {
              this.list.unshift(this.temp)
              this.creDepLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '推送成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch((error) => {
              this.errorMessage = '操作失败！'
              this.creDepLoading = false
              if (error.response.data.message) {
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '推送失败',
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
            }).catch((error) => {
              this.upDepLoading = false
              this.errorMessage = '操作失败！'
              if (error.response.data.message) {
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
          setData: function (dataTransfer) {
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
      },
      handleLayout(row) {
        this.$router.push({
          name: 'gridLayout',
          params: {
            name: row.name,
            id: row.id
          }
        })
      },
      handleSelectionChange(val) {
        this.selectedBoardIds = []
        val.forEach((item) => {
          this.selectedBoardIds.push(item.id)
        })
      },
      handleMessage() {
        this.resetTemp()
        console.log(this.selectedBoardIds)
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
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
  .mesPush .el-select {
    width: 100%;
  }

  .mesPush .el-input-number {
    width: 100%;
  }
</style>
