import type { GetMenuItemsQuery } from '@/graphql/generated/graphql';

export type NavbarItems = NonNullable<
  GetMenuItemsQuery['menuItems']
>['nodes'][number];
