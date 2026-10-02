import { WatchTenantCollection as WatchTenantCollection_1d0591e3cf4f332c83a86da13a0de59a } from '@payloadcms/plugin-multi-tenant/client'
import { OverviewComponent as OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaTitleComponent as MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { LinkToDoc as LinkToDoc_aead06e4cbf6b2620c5c51c9ab283634 } from '@payloadcms/plugin-search/client'
import { ReindexButton as ReindexButton_aead06e4cbf6b2620c5c51c9ab283634 } from '@payloadcms/plugin-search/client'
import { TenantSelector as TenantSelector_d6d5f193a167989e2ee7d14202901e62 } from '@payloadcms/plugin-multi-tenant/rsc'
import { TenantSelectionProvider as TenantSelectionProvider_d6d5f193a167989e2ee7d14202901e62 } from '@payloadcms/plugin-multi-tenant/rsc'
import { CollectionCards as CollectionCards_ab83ff7e88da8d3530831f296ec4756a } from '@payloadcms/ui/rsc'
import { CollectionQueryWidget as CollectionQueryWidget_ab83ff7e88da8d3530831f296ec4756a } from '@payloadcms/ui/rsc'
import { QueryPresetsWhereField as QueryPresetsWhereField_3817bf644402e67bfe6577f60ef982de } from '@payloadcms/ui'
import { CollectionQuerySortField as CollectionQuerySortField_3817bf644402e67bfe6577f60ef982de } from '@payloadcms/ui'
import { RecentlyViewedWidget as RecentlyViewedWidget_ab83ff7e88da8d3530831f296ec4756a } from '@payloadcms/ui/rsc'
import { RecentlyViewedCollectionsField as RecentlyViewedCollectionsField_3817bf644402e67bfe6577f60ef982de } from '@payloadcms/ui'
import { R2ClientUploadHandler as R2ClientUploadHandler_85cc02ed84006fcc91d3aff39dda669d } from '@payloadcms/storage-r2/client'

/** @type import('payload').ImportMap */
export const importMap = {
  "@payloadcms/plugin-multi-tenant/client#WatchTenantCollection": WatchTenantCollection_1d0591e3cf4f332c83a86da13a0de59a,
  "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-search/client#LinkToDoc": LinkToDoc_aead06e4cbf6b2620c5c51c9ab283634,
  "@payloadcms/plugin-search/client#ReindexButton": ReindexButton_aead06e4cbf6b2620c5c51c9ab283634,
  "@payloadcms/plugin-multi-tenant/rsc#TenantSelector": TenantSelector_d6d5f193a167989e2ee7d14202901e62,
  "@payloadcms/plugin-multi-tenant/rsc#TenantSelectionProvider": TenantSelectionProvider_d6d5f193a167989e2ee7d14202901e62,
  "@payloadcms/ui/rsc#CollectionCards": CollectionCards_ab83ff7e88da8d3530831f296ec4756a,
  "@payloadcms/ui/rsc#CollectionQueryWidget": CollectionQueryWidget_ab83ff7e88da8d3530831f296ec4756a,
  "@payloadcms/ui#QueryPresetsWhereField": QueryPresetsWhereField_3817bf644402e67bfe6577f60ef982de,
  "@payloadcms/ui#CollectionQuerySortField": CollectionQuerySortField_3817bf644402e67bfe6577f60ef982de,
  "@payloadcms/ui/rsc#RecentlyViewedWidget": RecentlyViewedWidget_ab83ff7e88da8d3530831f296ec4756a,
  "@payloadcms/ui#RecentlyViewedCollectionsField": RecentlyViewedCollectionsField_3817bf644402e67bfe6577f60ef982de,
  "@payloadcms/storage-r2/client#R2ClientUploadHandler": R2ClientUploadHandler_85cc02ed84006fcc91d3aff39dda669d
}
