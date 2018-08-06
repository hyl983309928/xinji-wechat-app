import ParentHome from './views/parent/Home'
import ParentCourse from './views/parent/course/Course'
import ParentFilter from './views/parent/course/Filter'
import ParentList from './views/parent/course/List'
import ParentDetail from './views/parent/course/Detail'
import ParentDetailPay from './views/parent/course/DetailPay'
import ParentCourseMaterial from './views/parent/course/CourseMaterial'
import ParentCourseMaterialShare from './views/parent/course/CourseMaterial_share'
import ParentShare from './views/parent/course/Share'
import ParentManage from './views/parent/course/Manage'
import ParentAfterClass from './views/parent/course/AfterClass'
import ParentReport from './views/parent/course/Report'
import ParentTaskCard from './views/parent/course/TaskCard'
import ParentNote from './views/parent/course/Note'
import ParentHomework from './views/parent/course/Homework'
import parentHomeworkShare from './views/parent/course/Homework_share'
import ParentSummary from './views/parent/course/Summary.vue'
import ParentSign from './views/parent/course/Sign'
import ParentSignUp from './views/parent/course/SignUp'
import ParentPay from './views/parent/course/Pay'
import ParentUCenter from './views/parent/UCenter'
import PayResult from './views/parent/course/PayResult'
import ParentPhotoCard from './views/parent/course/PhotoCard'
import parentShowAllPhoto from './views/parent/course/ShowAllPhoto'
// 家长 商品相关
import ParentCommodityIndex from './views/parent/commodity/Index'
import ParentCommodityDetail from './views/parent/commodity/Detail'
import ParentCommodityPay from './views/parent/commodity/Pay'
import ParentCommodityPayResult from './views/parent/commodity/PayResult'

import ParentDetailTour from './views/parent_tour/course/Detail'
import ParentCourseMaterialTour from './views/parent_tour/course/CourseMaterial'
import ParentCourseMaterialTourShare from './views/parent_tour/course/CourseMaterial_share'
import ParentCourseEnd from './views/parent_tour/course/TourCourseEnd'
import ParentReportTour from './views/parent_tour/course/Report'
import ParentTaskCardTour from './views/parent_tour/course/TaskCard'
import ParentPhotoCardTour from './views/parent_tour/course/PhotoCard'
import ParentNoteTour from './views/parent_tour/course/Note'
import ParentHomeworkTour from './views/parent_tour/course/Homework'
import parentHomeworkShareTour from './views/parent_tour/course/Homework_share'
import parentShowAllPhotoTour from './views/parent_tour/course/ShowAllPhoto'

import ReaderIndex from './views/parent/read/Index'
import ReaderList from './views/parent/read/List'
import ReaderDetail from './views/parent/read/Detail'
import ReaderDetailPreview from './views/parent/read/DetailPreview'

import ReaderOldFilter from './views/parent/course/ReaderFilter'
import ReaderOldList from './views/parent/course/ReaderList'
import ReaderOldDetail from './views/parent/course/ReaderDetail'
import ReaderOldFavorite from './views/parent/course/ReaderFavorite'

import LearnFilter from './views/parent/course/LearnFilter'
import LearnList from './views/parent/course/LearnList'
import LearnDetail from './views/parent/course/LearnDetail'
import MyLearn from './views/parent/course/MyLearn'
import LearnAfter from './views/parent/course/LearnAfter'
import LearnHomework from './views/parent/course/LearnHomework'
import LearnReport from './views/parent/course/LearnReport.vue'

import Coupon from './views/parent/coupon/Coupon'
import Convert from './views/parent/coupon/Convert'
import MyCoupon from './views/parent/coupon/MyCoupon'

import Agency from './views/agency/Agency'
import AgencyPerson from './views/agency/Person'
import OverdueMsg from './components/OverdueMsg'
// import AgencyCompile from './views/agency/Compile'
import AgencySummary from './views/agency/Summary'
import AgencyComment from './views/agency/Comment'
// import AgencyAddMaterial from './views/agency/AddMaterial'
import AgencyPreview from './views/agency/Preview'
import AgencyShowList from './views/agency/ShowList'
import AgencyUser from './views/agency/User'
import AgencyCourse from './views/agency/Course'
// import AgencyInclass from './views/agency/Inclass'
import AgencyCourseMaterial from './views/agency/CourseMaterial'
import AgencyCourseIntro from './views/agency/CourseIntro'
import AgencyCourseControl from './views/agency/CourseControl'
import AgencyCourseAnswer from './views/agency/CourseAnswer'
import AgencyHomeworkAnswer from './views/agency/HomeworkAnswer'
import AgencyMaterial from './views/agency/Material'
import AgencyAddMaterial from './views/agency/AddMaterial'
import AgencyEditMaterial from './views/agency/EditMaterial'
import AgencyQRCode from './views/agency/QRCode'
import AgencyApply from './views/agency/Apply'
import AgencyCheck from './views/agency/Check'

import AgencySummaryTour from './views/agency_tour/Summary'
import AgencyCommentTour from './views/agency_tour/Comment'
import AgencyPreviewTour from './views/agency_tour/Preview'
import AgencyCourseIntroTour from './views/agency_tour/CourseIntro'
import AgencyCourseControlTour from './views/agency_tour/CourseControl'
import AgencyCourseAnswerTour from './views/agency_tour/CourseAnswer'
import AgencyHomeworkAnswerTour from './views/agency_tour/HomeworkAnswer'
import AgencyQRCodeTour from './views/agency_tour/QRCode'

import SellerWrap from './views/seller/Wrap'
import SellerMain from './views/seller/Main'
import SellerCourseDetail from './views/seller/commodity/Detail'
import SellerSellLog from './views/seller/commodity/SellLog'
import SellerRechargeLog from './views/seller/record/RechargeLog'
import SellerAddBuyer from './views/seller/commodity/AddBuyer'
import SellerSignUp from './views/seller/commodity/SignUp'
import sellerFreePoster from './views/seller/commodity/FreePoster'
import SellerRecordDetail from './views/seller/record/RecordDetail'

module.exports = [{
  name: 'parent',
  path: '/',
  component: ParentHome // 个人主页
}, {
  name: 'parentHome',
  path: '/parent/home',
  component: ParentHome  // 个人主页
}, {
  name: 'parentUcenter',
  path: '/parent/ucenter',
  component: ParentUCenter // 个人中心
}, {
  name: 'coupon',
  path: '/parent/coupon',
  component: Coupon, // 嵌套路由
  children: [{
    path: 'convert',
    component: Convert // 积分换优惠券
  }, {
    path: 'my_coupon',
    component: MyCoupon // 我的卡券
  }]
}, {
  name: 'user',
  path: '/parent/user',
  component: require('./views/parent/user/User.vue'), // 嵌套路由
  children: [{
    path: 'bind_sid',
    component: require('./views/parent/user/BindSID.vue') // 绑定学号
  }, {
    path: 'bind_phone/:sid/:phone',
    component: require('./views/parent/user/BindPhone.vue') // 验证电话号码
  }, {
    path: 'data',
    component: require('./views/parent/user/Data.vue') // 宝贝档案
  }, {
    path: 'info',
    component: require('./views/parent/user/Info.vue') // 宝贝资料
  }, {
    path: 'info_edit/:type',
    component: require('./views/parent/user/InfoEdit.vue') // 宝贝资料
  }, {
    path: 'account',
    component: require('./views/parent/user/Account.vue') // 我的账户
  }, {
    path: 'recharge',
    component: require('./views/parent/user/Recharge.vue') // 充值页
  }, {
    path: 'recharge/:salesId',
    component: require('./views/parent/user/Recharge.vue') // 充值页（从销售处跳转来的）
  }, {
    path: 'recharge_re',
    component: require('./views/parent/user/RechargeRe.vue') // 充值结果页
  }, {
    path: 'log/:logType',
    component: require('./views/parent/user/RechargeLog.vue') // 充值 消费记录
  }, {
    path: 'contact_kf',
    component: require('./views/parent/user/ContactKf.vue') // 联系客服
  }, {
    path: 'info/:action',
    component: require('./views/parent/user/Info.vue') // 创建宝贝档案
  }, {
    path: 'grow_diary',
    component: require('./views/parent/user/growDiary.vue') // 创建宝贝档案
  }, {
    path: 'grow',
    component: require('./views/parent/user/Grow.vue') // 我的成长（已废弃）
  }, {
    path: 'report_list',
    component: require('./views/parent/user/ReportList.vue') // 报告列表（已废弃）
  }, {
    path: 'report/:month',
    component: require('./views/parent/user/Report.vue') // 月报告（已废弃）
  }, {
    path: 'rule',
    component: require('./views/parent/user/Rule.vue') // 成长规则（已废弃）
  }]
}, {
  name: 'reader',
  path: '/parent/reader', // 家长共读
  component: ReaderIndex, // 课程选择
  children: [{
    path: 'list/:filter',
    component: ReaderList //  共读选择列表
  }, {
    path: 'detail/:id',
    component: ReaderDetail // 详情
  }, {
    path: 'preview/:id',
    component: ReaderDetailPreview // 详情预览
  }]
}, {
  path: '/parent/commodity', // 家长 商品页
  component: ParentCommodityIndex, // 路由外壳主页
  children: [ {
    path: 'detail/:goodsId',
    component: ParentCommodityDetail   //  单课、组合详情
  }, {
    path: 'detail/:goodsId/:singleId',
    component: ParentCommodityDetail   // 组合内 单课详情
  }, {
    path: 'detail_seller/:goodsId/:sellerId',
    component: ParentCommodityDetail   //  单课、组合详情
  }, {
    path: 'pay/:orderId',
    component: ParentCommodityPay   // 支付页面
  }, {
    path: 'pay_result/:type',
    component: ParentCommodityPayResult // 支付结果
  }]
}, {
  path: '/parent/thirdParty',
  component: require('./views/parent/thirdParty/Index.vue'), // 家长报名第三方机构课程
  children: [
    {
      path: 'detail/:materialsType/:courseId',
      component: require('./views/parent/thirdParty/Detail.vue')
    },
    {
      path: 'successSignUp',
      component: require('./views/parent/thirdParty/SuccessSignUp.vue')
    }
  ]
}, {
  path: '/parent/course',
  component: ParentCourse, // 家长 课程页
  children: [{
    path: 'filter/:filterStr',
    component: ParentFilter // 课程选择
  }, {
    path: 'list/:filter',
    component: ParentList // 筛选后课程列表
  }, {
    path: 'detail/:id',
    component: ParentDetail // 课程详情页面
  }, {
    path: 'detail_pay/:id',
    component: ParentDetailPay // 单课程 支付详情页面
  }, {
    name: 'parentCourseMaterial',
    path: 'course_material/:id/:methodindex',
    component: ParentCourseMaterial // 课程资料 分屏页面 上课界面
  }, {
    name: 'parentCourseMaterialShare',
    path: 'course_material_share/:id/:methodindex',
    component: ParentCourseMaterialShare // 课程资料 分屏页面 上课界面
  }, {
    path: 'share',
    component: ParentShare //
  }, {
    path: 'manage',
    component: ParentManage // 管理课程界面
  }, {
    path: 'manage/:tab',
    component: ParentManage //
  }, {
    path: 'after_class/:id',
    component: ParentAfterClass // 下课后界面 含上课资料、课后作业、课程总结
  }, {
    name: 'OverdueMsg',
    path: 'overdue',
    component: OverdueMsg // 过期提示
  }, {
    name: 'parentHomework',
    path: 'homework/:id',
    component: ParentHomework // 课后作业
  }, {
    name: 'parentHomeworkShare',
    path: 'homework_share/:id',
    component: parentHomeworkShare // 课后作业
  }, {
    name: 'parentSummary',
    path: 'summary/:id',
    component: ParentSummary // 查看老师总结
  }, {
    path: 'sign/:id',
    component: ParentSign // 签到
  }, {
    path: 'report',
    component: ParentReport, // 整体报告 内容、答案、总结
    children: [
      {
        path: 'detail/:id',
        component: ParentDetail
      },
      {
        path: 'task_card/:id',
        component: ParentTaskCard
      },
      {
        path: 'note/:id',
        component: ParentNote
      },
      {
        path: 'homework/:id',
        component: ParentHomework
      },
      {
        path: 'photo_card/:id',
        component: ParentPhotoCard
      }
    ]
  }, {
    path: 'sign_up/:id/:channelId',
    component: ParentSignUp // 报名
  }, {
    path: 'pay_result/:type',
    component: PayResult // 充值成功  关注公众号和管理课程
  }, {
    path: 'sign_up/:id',
    component: ParentSignUp // 报名
  }, {
    path: 'pay/:orderId',
    component: ParentPay // 订单支付页面
  }, {
    path: 'reader_filter/:filter',
    component: ReaderOldFilter // 共读选择界面
  }, {
    path: 'reader_list/:filter',
    component: ReaderOldList // 共读选择结果页
  }, {
    path: 'reader_detail/:id',
    component: ReaderOldDetail //
  }, {
    path: 'reader_favorite',
    component: ReaderOldFavorite // 我的共读 已收藏
  }, {
    path: 'learn_filter',
    component: LearnFilter //
  }, {
    path: 'learn_list/:filter',
    component: LearnList //
  }, {
    path: 'learn_detail/:id',
    component: LearnDetail //
  }, {
    path: 'my_learn/:tab',
    component: MyLearn // 我的共学
  }, {
    path: 'my_learn',
    component: MyLearn //
  }, {
    path: 'learn_after/:id',
    component: LearnAfter //
  }, {
    name: 'learnHomework',
    path: 'learn_homework/:id',
    component: LearnHomework //
  }, {
    name: 'learnReport',
    path: 'learn_report/:id',
    component: LearnReport //
  }, {
    name: 'parentAllPhoto',
    path: 'all_photo/:type/:id',
    component: parentShowAllPhoto
  }]
},

{                       // 游学 家长入口
  path: '/parent/course_tour',
  component: ParentCourse, // 嵌套路由
  children: [{
    path: 'detail/:id',
    component: ParentDetailTour // 课程详情页面
  }, {
    name: 'parentCourseMaterial',
    path: 'course_material/:id/:methodindex',
    component: ParentCourseMaterialTour // 课程资料 分屏页面 上课界面
  }, {
    name: 'parentCourseMaterialShare',
    path: 'course_material_share/:id/:methodindex',
    component: ParentCourseMaterialTourShare // 课程资料 分屏页面 上课界面
  }, {
    name: 'parentCourseEnd',
    path: 'course_end',
    component: ParentCourseEnd // 课程资料 分屏页面 上课界面
  }, {
    name: 'OverdueMsg',
    path: 'overdue',
    component: OverdueMsg // 过期提示
  }, {
    name: 'parentHomework',
    path: 'homework/:id',
    component: ParentHomeworkTour // 课后作业
  }, {
    name: 'parentHomeworkShare',
    path: 'homework_share/:id',
    component: parentHomeworkShareTour // 课后作业
  }, {
    path: 'report',
    component: ParentReportTour, // 整体报告 内容、答案、总结
    children: [
      {
        path: 'detail/:id',
        component: ParentDetailTour
      },
      {
        path: 'task_card/:id',
        component: ParentTaskCardTour
      },
      {
        path: 'note/:id',
        component: ParentNoteTour
      },
      {
        path: 'homework/:id',
        component: ParentHomeworkTour
      },
      {
        path: 'photo_card/:id',
        component: ParentPhotoCardTour
      }
    ]
  }, {
    name: 'parentAllPhoto',
    path: 'all_photo/:type/:id',
    component: parentShowAllPhotoTour
  }]
},

{
  component: Agency,   // 游学 老师入口
  path: '/agency_tour',
  children: [{
    path: 'course_intro/:id',
    component: AgencyCourseIntroTour   // 上课 引导页
  }, {
    path: 'course_control/:id/:index',
    component: AgencyCourseControlTour   // 上课 控制页
  }, {
    path: 'course_answer/:id/:method/:task',
    component: AgencyCourseAnswerTour   // 上课 答案查看页
  }, {
    path: 'homework_answer/:id/:method/:task',
    component: AgencyHomeworkAnswerTour   // 作业 答案查看页
  }, {
    path: 'summary/:id',
    component: AgencySummaryTour   // 上课 总结页面
  }, {
    path: 'comment/:id',
    component: AgencyCommentTour   // 填写教学点评
  }, {
    path: 'preview/:id',
    component: AgencyPreviewTour   // 预览教案资料
  }, {
    path: 'qrcode/:id',
    component: AgencyQRCodeTour   // 生成签到二维码
  }, {
    path: 'apply',
    component: AgencyApply   // 申请认证界面
  }, {
    path: 'check',
    component: AgencyCheck   //  身份认证 需微信号 真实姓名
  }]
},
{
  component: Agency,   // 老师入口
  path: '/agency',
  children: [{
    path: 'person',
    component: AgencyPerson   //  个人
  }, {
    path: 'edit_material/:id',
    component: AgencyEditMaterial   // 编辑课程资料
  }, {
    path: 'add_material',
    component: AgencyAddMaterial   // 添加课程资料
  }, {
    path: 'course_material/:id',
    component: AgencyCourseMaterial   // 上课 滑动界面
  }, {
    path: 'course_intro/:id',
    component: AgencyCourseIntro   // 上课 引导页
  }, {
    path: 'course_control/:id/:index',
    component: AgencyCourseControl   // 上课 控制页
  }, {
    path: 'course_answer/:id/:method/:task',
    component: AgencyCourseAnswer   // 上课 答案查看页
  }, {
    path: 'homework_answer/:id/:method/:task',
    component: AgencyHomeworkAnswer   // 作业 答案查看页
  }, {
    path: 'summary/:id',
    component: AgencySummary   // 上课 总结页面
  }, {
    path: 'comment/:id',
    component: AgencyComment   // 填写教学点评
  }, {
    path: 'material',
    component: AgencyMaterial   // 资料列表
  }, {
    path: 'preview/:id',
    component: AgencyPreview   // 预览教案资料
  }, {
    path: 'show_list/:id',
    component: AgencyShowList   // 未知（已废弃）
  }, {
    path: 'user/:id',
    component: AgencyUser   // 查看学员（已废弃）
  }, {
    path: 'course',
    component: AgencyCourse   // 课程tab 含待上课 上课中 总结等
  }, {
    path: 'qrcode/:id',
    component: AgencyQRCode   // 生成签到二维码
  }, {
    path: 'apply',
    component: AgencyApply   // 申请认证界面
  }, {
    path: 'check',
    component: AgencyCheck   //  身份认证 需微信号 真实姓名
  }]
},

// 销售入口
{
  name: 'seller',
  component: SellerWrap,
  path: '/seller',
  children: [{
    path: ':tab',
    component: SellerMain   //  销售主页
  }, {
    path: 'course_detail/:type/:goodsId/:courseId',
    component: SellerCourseDetail   //  单课、组合详情
  }, {
    path: 'course_detail/:type/:goodsId/:courseId/:singleId',
    component: SellerCourseDetail   // 组合内 单课详情
  }, {
    path: 'course_QRcode/:goodsId',
    component: require('./views/seller/commodity/CommodityQRcode.vue') // 商品二维码
  }, {
    path: 'add_buyer/:id',
    component: SellerAddBuyer   // 添加家长
  }, {
    path: 'sign_up/:id',
    component: SellerSignUp   // 家长签收
  }, {
    path: 'record_detail/:id',
    component: SellerRecordDetail   // 销售记录详情
  }, {
    path: 'log/:id/:type',
    component: SellerSellLog   // 销售日志
  }, {
    path: 'record/recharge_log',
    component: SellerRechargeLog   // 销售日志
  }, {
    path: 'poster/:goodsId/:orderId',
    component: sellerFreePoster // 免费支付海报
  }]
},
{
  name: 'capsule',         // 胶囊入口
  component: require('./views/capsule/index.vue'),
  path: '/capsule',
  children: [{
    path: 'home',
    component: require('./views/capsule/Home.vue')
  }, {
    path: 'list/:filter',
    component: require('./views/capsule/List.vue')
  }, {
    path: 'info/:id',
    component: require('./views/capsule/Info.vue')
  }, {
    path: 'exercise/:type/:id',
    component: require('./views/capsule/Exercise.vue')
  }, {
    path: 'exerciseEnd/:id',
    component: require('./views/capsule/ExerciseEnd.vue')
  }, {
    path: 'exerciseBack/:capsuleId',
    component: require('./views/capsule/ExerciseBack.vue')
  }, {
    path: 'myCapsule',
    component: require('./views/capsule/MyCapsule.vue')
  }]
},
{
  name: 'newCapsule',         // 胶囊入口
  component: require('./views/newCapsule/index.vue'),
  path: '/newCapsule',
  children: [
    {
      path: 'home',
      component: require('./views/newCapsule/Home.vue')
    }, {
      path: 'list',
      component: require('./views/newCapsule/List.vue')
    }, {
      path: 'info/:id',
      component: require('./views/newCapsule/Info.vue')
    }, {
      path: 'guideShare/:id',
      component: require('./views/newCapsule/GuideShare.vue')
    }, {
      path: 'guideShare_share/:id',
      component: require('./views/newCapsule/GuideShare_share.vue')
    }, {
      path: 'register',
      component: require('./views/newCapsule/Register.vue')
    }, {
      path: 'register/:id',
      component: require('./views/newCapsule/Register.vue')
    }, {
      path: 'guideShareBack/:info',
      component: require('./views/newCapsule/GuideShareBack.vue')
    }
  ]
}
]
