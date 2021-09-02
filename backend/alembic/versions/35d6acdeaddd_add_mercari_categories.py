"""Add: Mercari categories

Revision ID: 35d6acdeaddd
Revises:
Create Date: 2021-09-04 15:52:57.245130

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '35d6acdeaddd'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'mercari_categories',
        sa.Column('id', sa.Integer, autoincrement=True, primary_key=True),
        sa.Column('name', sa.Text),
        sa.Column('category_root_id', sa.Integer, nullable=False),
        sa.Column('category_child_id', sa.Integer, nullable=True),
        sa.Column('category_grand_child_id', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(
        op.f('ix_mercari_categories_category_root_id'),
        'mercari_categories',
        ['category_root_id'],
        unique=False,
    )


def downgrade():
    op.drop_index('ix_mercari_categories_category_root_id', table_name='mercari_categories')
    op.drop_table('mercari_categories')
