import type { Schema, Attribute } from '@strapi/strapi';

export interface OrderedItemOrderItem extends Schema.Component {
  collectionName: 'components_ordered_item_order_items';
  info: {
    displayName: 'OrderItem';
    description: '';
  };
  attributes: {
    quantity: Attribute.Integer;
    total: Attribute.Decimal;
    product: Attribute.Relation<
      'ordered-item.order-item',
      'oneToOne',
      'api::product.product'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ordered-item.order-item': OrderedItemOrderItem;
    }
  }
}
