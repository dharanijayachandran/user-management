import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountMenuComponent } from './account/pages/account-menu/account-menu.component';
import { AccountRoleFormComponent } from './account/pages/account-role-form/account-role-form.component';
import { AccountRolePreviewComponent } from './account/pages/account-role-preview/account-role-preview.component';
import { AccountRoleReadViewComponent } from './account/pages/account-role-read-view/account-role-read-view.component';
import { AccountRoleViewComponent } from './account/pages/account-role-view/account-role-view.component';
import { AccountRoleComponent } from './account/pages/account-role/account-role.component';
import { AccountUserFormComponent } from './account/pages/account-user-form/account-user-form.component';
import { AccountUserRoleComponent } from './account/pages/account-user-role/account-user-role.component';
import { AccountUserComponent } from './account/pages/account-user/account-user.component';
import { AccountViewComponent } from './account/pages/account-view/account-view.component';
import { AccountComponent } from './account/pages/account/account.component';
import { AddAccountComponent } from './account/pages/add-account/add-account.component';
import { AssetDataAccessComponent } from './data access/pages/asset-data-access/asset-data-access.component';
import { DashboardDataAccessComponent } from './data access/pages/dashboard-data-access/dashboard-data-access.component';
import { GatewayDataAccessComponent } from './data access/pages/gateway-data-access/gateway-data-access.component';
import { ManageDataAccessComponent } from './data access/pages/manage-data-access/manage-data-access.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ownerMenuComponent } from './owner/pages/owner-menu/owner-menu.component';
import { OrganizationProfileComponent } from './pages/organization-profile/organization-profile.component';
import { PasswordChangeComponent } from './pages/password-change/password-change.component';
import { PreviewComponent } from './pages/preview/preview.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RoleFormComponent } from './pages/role-form/role-form.component';
import { SearchUserComponent } from './pages/search-user/search-user.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { UserViewModeComponent } from './pages/user-view-mode/user-view-mode.component';
import { RoleFormViewComponent } from './role/pages/role-form-view/role-form-view.component';
import { RoleListComponent } from './role/pages/role-list/role-list.component';
import { RoleMenuComponent } from './role/pages/role-menu/role-menu.component';
import { RolePreviewComponent } from './role/pages/role-preview/role-preview.component';
import { RoleViewComponent } from './role/pages/role-view/role-view.component';
import { RoleComponent } from './role/pages/role/role.component';
import { ViewComponent } from './role/pages/view/view.component';
import { SignOnHistoryComponent } from './sign-on-history/pages/sign-on-history/sign-on-history.component';
import { AddtenantComponent } from './tenant/pages/addtenant/addtenant.component';
import { TenantAssignApplicationsComponent } from './tenant/pages/tenant-assign-applications/tenant-assign-applications.component';
import { TenantMenuComponent } from './tenant/pages/tenant-menu/tenant-menu.component';
import { TenantReadViewComponent } from './tenant/pages/tenant-read-view/tenant-read-view.component';
import { TenantRoleFormComponent } from './tenant/pages/tenant-role-form/tenant-role-form.component';
import { TenantRoleViewComponent } from './tenant/pages/tenant-role-view/tenant-role-view.component';
import { TenantRoleComponent } from './tenant/pages/tenant-role/tenant-role.component';
import { TenantUserFormComponent } from './tenant/pages/tenant-user-form/tenant-user-form.component';
import { TenantUserRoleComponent } from './tenant/pages/tenant-user-role/tenant-user-role.component';
import { TenantUserComponent } from './tenant/pages/tenant-user/tenant-user.component';
import { TenantViewComponent } from './tenant/pages/tenant-view/tenant-view.component';
import { TenantComponent } from './tenant/pages/tenant/tenant.component';
import { TenentRolePreviewComponent } from './tenant/pages/tenent-role-preview/tenent-role-preview.component';
import { OwnerUserFormComponent } from './user/pages/owner-user-form/owner-user-form.component';
import { OwnerUserComponent } from './user/pages/owner-user/owner-user.component';
import { UserRoleComponent } from './user/pages/user-role/user-role.component';
import { UserComponent } from './user/pages/user/user.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { PendingChangesGuard } from 'global';
import { AddressFormComponent } from './Shared/address-form/address-form.component';
import { ExportAddSearchUserComponent } from './Shared/components/export-add-search-user/export-add-search-user.component';


const routes: Routes = [
  {
    path: 'organization-profile',
    component: OrganizationProfileComponent
  },
  {
    path: 'welcome',
    component: WelcomePageComponent
  },
  {
    path: 'user-signon-history',
    component: SignOnHistoryComponent
  },
  {
    path: 'tenant',
    children: [
      {
        path: '',
        component: TenantComponent,
        pathMatch: 'full'
      },
      {
        path: 'addTenant',
        component: AddtenantComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'view/:id',
        component: PreviewComponent
      },
      {
        path: 'tenantMenu',
        component: TenantMenuComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: "tenantRoleForm",
        component: TenantRoleFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'tenantUserForm',
        component: TenantUserFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'tenantUserRole',
        component: TenantUserRoleComponent
      },
      {
        path: 'tenant-role',
        component: TenantRoleComponent
      },

      {
        path: 'tenantRoleView',
        component: TenantRoleViewComponent
      },
      {
        path: 'tenantRolePreview',
        component: TenentRolePreviewComponent
      },
      {
        path: 'userViewMode',
        component: UserViewModeComponent
      },
      {
        path:'tenantAssignApplications',
        component: TenantAssignApplicationsComponent
      },
      {
        path: 'search',
        component: SearchUserComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]
  },
  {
    path: 'account',
    children: [
      {
        path: '',
        component: AccountComponent,
        pathMatch: 'full'
      },
      {
        path: 'addAccount',
        component: AddAccountComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'view/:id',
        component: PreviewComponent
      },
      {
        path: 'accountMenu',
        component: AccountMenuComponent
      },
      {
        path: 'acountUserForm',
        component: AccountUserFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'accountUserRole',
        component: AccountUserRoleComponent
      },
      {
        path: 'account-role',
        component: AccountRoleComponent
      },
      {
        path: "accountRoleForm",
        component: AccountRoleFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'accountRoleView',
        component: AccountRoleViewComponent
      },
      {
        path: 'accountRolePreview',
        component: AccountRolePreviewComponent
      },
      {
        path: 'userViewMode',
        component: UserViewModeComponent
      }
    ]
  },
  {
    path: 'manage-user',
    children: [
      {
        path: '',
        component: UserComponent,
        pathMatch: 'full'
      },
      {
        path: 'manageUserForm',
        component: OwnerUserFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'manageUserRole',
        component: UserRoleComponent
      },
      {
        path: 'userViewMode',
        component: UserViewModeComponent
      },
      {
        path: 'search',
        component: SearchUserComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]
  },
  {
    path: 'assign-menu',
    component: ownerMenuComponent,
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'manage-role',
    children: [
      {
        path: '',
        component: RoleComponent
      },
      {
        path: 'roleForm',
        component: RoleFormViewComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'roleView',
        component: RoleViewComponent
      },
      {
        path: 'rolePreview',
        component: RolePreviewComponent
      },
      {
        path: 'roleMenu',
        component: RoleMenuComponent,
        canDeactivate: [PendingChangesGuard]
      }
    ]
  },
  {
    path: 'manage-data-access',
    children: [
      {
        path: '',
        component: ManageDataAccessComponent,
        pathMatch: 'full'
      },
      {
        path: 'asset-data-access',
        component: AssetDataAccessComponent
      },
      {
        path: 'gateway-data-access',
        component: GatewayDataAccessComponent
      },
      {
        path: 'dashboard-data-access',
        component: DashboardDataAccessComponent
      }
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'password-change',
    component: PasswordChangeComponent
  },
  {
    path: 'resetpass',
    component: ResetPasswordComponent
  },
  {
    path: '**',
    component: EmptyRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/user-config' },
  ],
})
export class AppRoutingModule { }

export const userComponentDeclaration = [
  OrganizationProfileComponent,
  SignOnHistoryComponent,
  TenantComponent,
  WelcomePageComponent,
  TenantViewComponent,
  AddtenantComponent,
  TenentRolePreviewComponent,
  TenantRoleViewComponent,
  TenantRoleComponent,
  TenantUserRoleComponent,
  TenantUserFormComponent,
  TenantRoleFormComponent,
  TenantMenuComponent,
  UserViewModeComponent,
  PreviewComponent,
  AccountRolePreviewComponent,
  AccountRoleViewComponent,
  AccountRoleFormComponent,
  AccountRoleComponent,
  AccountUserRoleComponent,
  AccountUserFormComponent,
  AccountMenuComponent,
  AddAccountComponent,
  AccountComponent,
  RoleMenuComponent,
  RolePreviewComponent,
  RoleViewComponent,
  RoleFormViewComponent,
  RoleComponent,
  ownerMenuComponent,
  UserRoleComponent,
  OwnerUserFormComponent,
  UserComponent,
  TenantUserComponent,
  AccountViewComponent,
  OwnerUserComponent,
  RoleListComponent,
  AddressFormComponent,
  RoleFormComponent,
  AccountRoleReadViewComponent,
  AccountUserComponent,
  PasswordChangeComponent,
  ProfileComponent,
  ManageDataAccessComponent,
  AssetDataAccessComponent,
  GatewayDataAccessComponent,
  DashboardDataAccessComponent,
  SearchUserComponent,
  SearchUserComponent,
  ExportAddSearchUserComponent,
  ViewComponent,
  TenantReadViewComponent,
  ResetPasswordComponent,
  UserFormComponent,
];
