import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Lazy-loaded Admin & Secondary Chunks (Code-Splitting)
const AdminLogin = () => import('../views/admin/AdminLogin.vue')
const AdminLayout = () => import('../views/admin/AdminLayout.vue')
const AdminDashboard = () => import('../views/admin/AdminDashboard.vue')
const AdminProducts = () => import('../views/admin/AdminProducts.vue')
const AdminServices = () => import('../views/admin/AdminServices.vue')
const AdminVisitors = () => import('../views/admin/AdminVisitors.vue')
const AdminTestimonials = () => import('../views/admin/AdminTestimonials.vue')
const TestimonialsView = () => import('../views/TestimonialsView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/p/:slug',
    name: 'ProductDirectShare',
    component: HomeView
  },
  {
    path: '/testimonials',
    name: 'Testimonials',
    component: TestimonialsView
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'product',
        name: 'AdminProducts',
        component: AdminProducts
      },
      {
        path: 'service',
        name: 'AdminServices',
        component: AdminServices
      },
      {
        path: 'visitors',
        name: 'AdminVisitors',
        component: AdminVisitors
      },
      {
        path: 'testimonials',
        name: 'AdminTestimonials',
        component: AdminTestimonials
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Route guard untuk proteksi halaman admin
router.beforeEach((to, _from, next) => {
  const isAuth = localStorage.getItem('pull_store_admin_session') === 'true'
  
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!isAuth) {
      return next('/admin/login')
    }
  }

  // Jika sudah login dan buka login page, lempar ke dashboard
  if (to.path === '/admin/login' && isAuth) {
    return next('/admin/dashboard')
  }

  next()
})
