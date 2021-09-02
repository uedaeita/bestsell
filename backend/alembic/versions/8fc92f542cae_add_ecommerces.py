"""Add: Ecommerces

Revision ID: 8fc92f542cae
Revises: 35d6acdeaddd
Create Date: 2021-09-06 02:22:52.546969

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8fc92f542cae'
down_revision = '35d6acdeaddd'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'ecommerces',
        sa.Column('id', sa.Integer, autoincrement=True, primary_key=True),
        sa.Column('name', sa.Text, nullable=False),
        sa.Column('code', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )


def downgrade():
    op.drop_table('ecommerces')
