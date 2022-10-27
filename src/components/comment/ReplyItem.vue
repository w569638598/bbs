<template>
  <v-list-item class="pl-0">
    <v-list-item-avatar class="mb-auto">
      <v-img :src="`${baseURL}${comment.sysUser.avatar}`"></v-img>
    </v-list-item-avatar>
    <v-list-item-content class="text-left">
      <v-list-item-subtitle>
        <span>{{comment.sysUser && comment.sysUser.realname}}</span>
        <span v-if="hasCommentPower" class="commentItem-reply">回复</span>
        <span>{{comment.toUser && comment.toUser.realname}}</span>
        <span class="ml-2">{{moment(comment.createTime).fromNow()}}</span>
      </v-list-item-subtitle>
      <v-list-item-title class="my-2">
        <span class="text-pre-wrap">{{comment.content}}</span>
      </v-list-item-title>
      <v-list-item-subtitle>
        <span class="mr-2" key="comment-basic-like" style="cursor: pointer;" @click="like">
          <v-icon :size="14" v-if="comment.isThumbUp !== 1">fa fa-thumbs-o-up</v-icon>
          <v-icon :size="14" v-else color="#1976d2">fa fa-thumbs-up</v-icon>
          <span>
            {{ comment.thumbUpNumber }}
          </span>
        </span>
        <a key="comment-basic-reply-to" v-if="hasCommentPower" @click="handleReply">{{bmsComment === comment.id?'取消回复':'回复'}}</a>
        <a class="ml-2" v-if="token && userInfo().id === comment.userId">
          <span class="tag" @click="() => handleDelete(comment.id)">删除</span>
        </a>
        <Reply
          v-if="bmsComment === comment.id && hasCommentPower"
          :key="comment.id"
          :comment="comment"
          :parentId="parentId"
          @loadComments="loadComments"
        />
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { deleteComment } from '@/api/post'
import { mapGetters } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
// import { comment as AComment } from 'ant-design-vue'
import Reply from './Reply'
import { thumbsUp } from '@/api/post'
export default {
  name: 'ReplyItem',
  components: {
    // AComment,
    Reply
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    hasCommentPower: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      baseURL: '',
      action: null,
      moment,
      bmsComment: ''
    }
  },
  computed: {
    ...mapGetters([
      'token', 'user'
    ])
  },
  mounted() {
    this.baseURL = window._CONFIG['staticDomainURL'] + '/'
  },
  methods: {
    ...mapGetters(['userInfo']),
    handleDelete(id) {
      deleteComment({ id: id }).then(value => {
        const { code } = value
        if (code === 200) {
          this.$message.success('删除成功')
          this.$emit('loadComments', this.slug)
        }
      })
    },
    like() {
      thumbsUp({ id: this.comment.id }).then(res => {
        if (res.code === 200) {
          this.comment.thumbUpNumber = res.data.thumbUpNumber
          this.$emit('loadComments')
        }
      })
    },
    loadComments() {
      this.$emit('loadComments')
    },
    handleReply() {
      this.bmsComment = this.bmsComment === this.comment.id ? '' : this.comment.id
    }
  }
}
</script>
<style scoped>
.avatar{
  width: 100%;
  height: 100%;
}
.commentItem-reply-user{
  color:#000 ;
}
.commentItem-reply{
  color: #8590a6;
  margin: 0px 5px;
}
.isThumbUp{
  color: #06f;
}

</style>
