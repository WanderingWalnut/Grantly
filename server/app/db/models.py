from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    Date,
    TIMESTAMP,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func, text
from sqlalchemy.orm import relationship

from .base import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    legal_business_name = Column(Text, nullable=False)
    operating_name = Column(Text)
    business_number = Column(String(15))
    business_structure = Column(Text)
    address = Column(Text)
    contact_information = Column(Text)
    date_of_establishment = Column(Date)
    phone_number = Column(String(20))
    email_address = Column(Text, index=True)
    number_of_employees = Column(Integer)
    business_sector = Column(Text)
    mission_statement = Column(Text)
    company_description = Column(Text)
    target_beneficiaries = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False, onupdate=func.now())

    representatives = relationship("Representative", back_populates="organization", cascade="all, delete-orphan")


class Representative(Base):
    __tablename__ = "representatives"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    organization_id = Column(PG_UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"))
    full_name = Column(Text, nullable=False)
    role_in_company = Column(Text)
    email = Column(Text, nullable=False, index=True)
    auth_user_id = Column(PG_UUID(as_uuid=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    organization = relationship("Organization", back_populates="representatives")


__all__ = ["Organization", "Representative"]
