import type { Meta, StoryObj } from '@storybook/react';
import { EventsList } from '@openshift-assisted/ui-lib/ocm'

const meta = {
  title: 'Example/EventsList',
  component: EventsList,
  tags: ['autodocs'],

} satisfies Meta<typeof EventsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    events: []
  },
};
