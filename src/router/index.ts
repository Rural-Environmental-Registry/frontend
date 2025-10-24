import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import PropertiesView from '@/views/PropertiesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LandholdersInformationView from '@/views/RegisterViews/LandholdersInformationView.vue'
import RegistrarsDetailsView from '@/views/RegisterViews/RegistrarsDetailsView.vue'
import PropertyMapView from '@/views/RegisterViews/PropertyMapView.vue'
import RuralPropertyView from '@/views/RegisterViews/RuralPropertyView.vue'
import PropertyRightsView from '@/views/RegisterViews/PropertyRightsView.vue'
import PropertyDetailsView from '@/views/PropertyDetailsView.vue'
import LogoutView from '@/views/LogoutView.vue'
import { checkAuth } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'property_map',
          component: PropertyMapView,
        },
        {
          path: 'registrars_details',
          component: RegistrarsDetailsView,
        },
        {
          path: 'landholders_information',
          component: LandholdersInformationView,
        },
        {
          path: 'rural_property',
          component: RuralPropertyView,
        },
        {
          path: 'property_rights',
          component: PropertyRightsView,
        },
      ],
    },
    {
      path: '/properties',
      name: 'properties',
      component: PropertiesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/properties/details/:id',
      name: 'property_details',
      component: PropertyDetailsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  if (requiresAuth && import.meta.env.MODE === 'production') {
    const isAuthenticated = checkAuth()
    if (!isAuthenticated) {
      window.location.href = `${import.meta.env.VITE_AUTH_MODULE_URL}/login`
      return
    }
  }
  next()
})

export default router
